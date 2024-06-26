#! /bin/bash

service_name=$1

if [[ ! -r "$SECRET_PATH" ]]; then
	echo "Permission denied: remove service."
    exit 1
fi

if [ -z "${service_name}" ]; then
    echo "No arguments: remove service."
    exit 1
fi

mkdir -p tmp
mkdir -p new

source "$SECRET_PATH"
basic_token=$(echo -n "$ADMIN_ID:$ADMIN_PW" | base64)
urlencode=$(echo -n "${service_name}" | jq -sRr @uri)
org_admin=1

# 1. orgId 받아오기
# Get Organization by Name : https://grafana.com/docs/grafana/latest/developers/http_api/org/#get-organization-by-name

message=$(curl -s -X GET \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/orgs/name/${urlencode})
orgId=$(echo ${message} | jq -r '.id')

if [ "${orgId}" = "null" ]; then
	echo "Service not exist: remove service."
	exit 1
fi

echo "${message}"

# 2. org 변경
# Switch user context for signed in user : https://grafana.com/docs/grafana/latest/developers/http_api/user/
curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/user/using/${orgId}

echo ""

# 3. teamId 받아오기
# Team Search With Paging : https://grafana.com/docs/grafana/latest/developers/http_api/team/#team-search-with-paging
message=$(curl -s -X GET \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/teams/search?name=${urlencode})
teamId=$(echo ${message} | jq -r '.teams | .[0] | .id')

echo "${message}"

# 4. 팀 삭제 
# Delete Team By Id : https://grafana.com/docs/grafana/latest/developers/http_api/team/#delete-team-by-id
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/teams/${teamId}

echo ""

# 5. 대시보드 삭제
# Folder/Dashboard Search API : https://grafana.com/docs/grafana/latest/developers/http_api/folder_dashboard_search/#folderdashboard-search-api
# Delete dashboard by uid : https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#delete-dashboard-by-uid
dashboards=$(curl -s -X GET \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/search?query=${service_name})

trimmed=${dashboards#"["}
trimmed=${trimmed%"]"}

IFS='}' read -r -a elements <<< "$trimmed"

for element in "${elements[@]}"; do
	element="${element}}"
	element=${element#","}
    uid=$(echo "${element}" | jq -r ".uid")
	
	curl -s -X DELETE \
		-H "Accept: application/json" \
		-H "Content-Type: application/json" \
		-H "Authorization: Basic ${basic_token}" \
		$GRAFANA_APISERVER/api/dashboards/uid/${uid}
	
	echo ""
done

# 6. 유저 삭제
# Get Users in Organization : https://grafana.com/docs/grafana/latest/developers/http_api/org/#get-users-in-organization
user_name=$(curl -s -X GET \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ${basic_token}" \
  $GRAFANA_APISERVER/api/orgs/${orgId}/users)

echo "user_name : ${user_name}"

trimmed=${user_name#"["}
trimmed=${trimmed%"]"}

IFS='}' read -r -a elements <<< "$trimmed"

for element in "${elements[@]}"; do
	element="${element}}"
	element=${element#","}
    userId=$(echo "${element}" | jq -r ".userId")

    if [ ${userId} -eq "1" ]; then
		continue
	fi
	
	# Delete global User : https://grafana.com/docs/grafana/latest/developers/http_api/admin/#delete-global-user
	curl -s -X DELETE \
		-H "Accept: application/json" \
		-H "Content-Type: application/json" \
		-H "Authorization: Basic ${basic_token}" \
		$GRAFANA_APISERVER/api/admin/users/${userId}
	
	echo ""
done

# 7. datasource uid 조회 및 삭제
# Get a single data source by name : https://grafana.com/docs/grafana/latest/developers/http_api/data_source/#get-a-single-data-source-by-name
message=$(curl -s -X GET \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/datasources/name/prometheus)
# -r 옵션은 ""을 떼- 준다
uid=$(echo ${message} | jq -r '.uid')

echo "${message}"

# Delete an existing data source by uid : https://grafana.com/docs/grafana/latest/developers/http_api/data_source/#delete-an-existing-data-source-by-uid
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/datasources/uid/${uid}

echo ""

# 8. Admin org로 다시 변경
# Switch user context for signed in user : https://grafana.com/docs/grafana/latest/developers/http_api/user/
curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/user/using/${org_admin}

echo ""

# 9. org 삭제
# Delete Organization : https://grafana.com/docs/grafana/latest/developers/http_api/org/#delete-organization
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/orgs/${orgId}

echo ""

bash update_service_json.sh remove ${service_name}

rm new/${service_name}.json