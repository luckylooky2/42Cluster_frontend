#! /bin/bash

service_name=$1

if [ -z "${service_name}" ]; then
    echo "No arguments: add service."
    exit 1
fi

basic_token=$(echo -n "$GRAFANA_ADMIN_ID:$GRAFANA_ADMIN_PW" | base64)
org_admin=1

# 1. org 생성(자동으로 admin은 추가)
# https://stackoverflow.com/questions/22853406/how-can-i-quiet-all-the-extra-text-when-using-curl-within-a-shell-script
# https://stackoverflow.com/questions/296536/how-to-urlencode-data-for-curl-command?page=1&tab=scoredesc#tab-top
# jq 패키지 설치 필요
# Create Organization : https://grafana.com/docs/grafana/latest/developers/http_api/org/#create-organization
message=$(curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"name\":\"${service_name}\"}" \
	$GRAFANA_APISERVER/api/orgs)
orgId=$(echo ${message} | jq -r '.orgId')

if [ "${orgId}" = "null" ]; then
	echo "Service already exist: add service."
	exit 1
fi

echo "${message}"

# 2. org 변경
# Switch user context for signed in user : https://grafana.com/docs/grafana/latest/developers/http_api/user/
curl -s -X POST \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/user/using/${orgId}

echo ""

# 3. 유저 생성
# auto_assign_org : false로 해야 함

# Global Users : https://grafana.com/docs/grafana/latest/developers/http_api/admin/#global-users
message=$(curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"name\":\"${service_name}\",\"email\":\"${service_name}@graf.com\",\"login\":\"${service_name}\",\"password\":\"1234\"}" \
	$GRAFANA_APISERVER/api/admin/users)
userId=$(echo ${message} | jq -r '.id')

echo "${message}"

# 4. 생성된 유저를 현재 org에 추가 및 첫 번째 org에서 제거
# Add a new user to the current organization : https://grafana.com/docs/grafana/latest/developers/http_api/org/#add-a-new-user-to-the-current-organization
curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"role\":\"Viewer\",\"loginOrEmail\":\"${service_name}\"}" \
	$GRAFANA_APISERVER/api/org/users

echo ""

# Delete User in Organization : https://grafana.com/docs/grafana/latest/developers/http_api/org/#delete-user-in-organization
curl -s -X DELETE \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/orgs/${org_admin}/users/${userId}

echo ""

# 4. 현재 org에 datasource 추가
# Create a data source : https://grafana.com/docs/grafana/latest/developers/http_api/data_source/#create-a-data-source
curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"name\":\"prometheus\",\"type\":\"prometheus\",\"access\":\"proxy\",\"url\":\"$PROMETHEUS_SERVER\",\"isDefault\":true,\"version\":\"1\",\"editable\":false}" \
	$GRAFANA_APISERVER/api/datasources

echo ""

# 5. 대시보드 생성
# Get dashboard by uid : https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#get-dashboard-by-uid
# Create / Update dashboard : https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#create--update-dashboard
bash create_json.sh ${service_name}
dashboardId=$(bash create_dashboard.sh "new/${service_name}.json")

# 6. 팀 생성(마찬가지로 admin 자동 추가) 및 생성된 유저 추가
# 현재 org을 기준으로 생성 및 조회
# Add Team : https://grafana.com/docs/grafana/latest/developers/http_api/team/#add-team
message=$(curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"name\":\"${service_name}\"}" \
	$GRAFANA_APISERVER/api/teams)
teamId=$(echo ${message} | jq -r '.teamId')

echo "${message}"

# Add Team Member : https://grafana.com/docs/grafana/latest/developers/http_api/team/#add-team-member
curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"userId\":${userId}}" \
	$GRAFANA_APISERVER/api/teams/${teamId}/members

echo ""

# 7. 홈 대시보드 설정
# Update Team Preferences : https://grafana.com/docs/grafana/latest/developers/http_api/team/#get-team-preferences
curl -s -X PUT \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"homeDashboardId\":${dashboardId}}" \
	$GRAFANA_APISERVER/api/teams/${teamId}/preferences

echo ""


# 8. Admin org로 다시 변경
# Switch user context for signed in user : https://grafana.com/docs/grafana/latest/developers/http_api/user/
curl -s -X POST \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/user/using/${org_admin}

echo ""

bash update_service_json.sh add ${service_name}
