#! /bin/bash

# 가장 처음 한 번만 실행되는 스크립트
# - DB에 영향을 주기 때문에, 최초로 서비스가 올라가는 시점에만 실행되어야 한다
# - 실행 시점 : 모든 Grafana 컨테이너가 올라간 뒤

# provisioning으로 대시보드를 구성하지 않는다
# dashboard를 생성할 때는 반드시 "id": null를 설정하고, { dashboard: {} } 로 감싸주어야 한다

if [[ ! -r "$SECRET_PATH" ]]; then
	echo "Permission denied: init 42cluster"
    exit 1
fi

source "$SECRET_PATH"
basic_token=$(echo -n "$ADMIN_ID:$ADMIN_PW" | base64)

# 1. 첫 번째 Org 이름을 Admin으로 변경
# Update Organization : https://grafana.com/docs/grafana/latest/developers/http_api/org/#update-organization
curl -s -X PUT \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"name\":\"Admin\"}" \
	$GRAFANA_APISERVER/api/orgs/1

echo ""

# # 2. Admin Org 추가
# # Create Organization : https://grafana.com/docs/grafana/latest/developers/http_api/org/#create-organization
# message=$(curl -s -X POST \
# 	-H "Accept: application/json" \
# 	-H "Content-Type: application/json" \
# 	-H "Authorization: Basic ${basic_token}" \
# 	-d "{\"name\":\"Admin\"}" \
# 	$GRAFANA_APISERVER/api/orgs)
# orgId=$(echo ${message} | jq -r '.orgId') 

# echo "${message}"

# # 3. Admin Org로 변경(이후 고정)
# # Switch user context for signed in user : https://grafana.com/docs/grafana/latest/developers/http_api/user/
# curl -s -X POST \
# 	-H "Authorization: Basic ${basic_token}" \
# 	$GRAFANA_APISERVER/api/user/using/${orgId}

# echo ""

# 4. 대시보드 추가
bash create_dashboard.sh v2/metrics/cluster.json
bash create_dashboard.sh v2/metrics/cluster-node.json
bash create_dashboard.sh v2/metrics/cluster-namespace.json
bash create_dashboard.sh v2/metrics/node-detail.json
bash create_dashboard.sh v2/metrics/namespace-detail.json
bash create_dashboard.sh v2/metrics/service-overview.json

bash create_dashboard.sh v2/deployments/argocd.json
bash create_dashboard.sh v2/deployments/argocd-application-overview.json
bash create_dashboard.sh v2/deployments/argocd-operation-overview.json

# 5. datasource 추가
curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"name\":\"prometheus\",\"type\":\"prometheus\",\"access\":\"proxy\",\"url\":\"$PROMETHEUS_SERVER\",\"isDefault\":true,\"version\":\"1\",\"editable\":false}" \
	$GRAFANA_APISERVER/api/datasources

# 6. Team 생성
message=$(curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"name\":\"Admin\"}" \
	$GRAFANA_APISERVER/api/teams)
teamId=$(echo ${message} | jq -r '.teamId')

echo "${message}"

# 7. 홈 대시보드 설정
# Update Team Preferences : https://grafana.com/docs/grafana/latest/developers/http_api/team/#get-team-preferences
curl -s -X PUT \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "{\"homeDashboardId\": 1}" \
	$GRAFANA_APISERVER/api/teams/${teamId}/preferences

echo ""
