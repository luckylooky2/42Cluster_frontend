#! /bin/bash

command=$1
service_name=$2

if [ ${command} != 'add' -a ${command} != 'remove' ]; then
	echo "Invalid Command: update service.json"
	exit 1
fi

if [ -z "${service_name}" ]; then
    echo "No arguments: update service.json"
    exit 1
fi

mkdir -p tmp
mkdir -p new

basic_token=$(echo -n "$GRAFANA_ADMIN_ID:$GRAFANA_ADMIN_PW" | base64)

# Get dashboard by uid : https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#get-dashboard-by-uid
message=$(curl -s -X GET \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/dashboards/uid/mb0d919ec0ea5f6543124e16c42a5a87)

id=$(echo ${message} | jq -r '.dashboard.id')
uid=$(echo ${message} | jq -r '.dashboard.uid')
version=$(echo ${message} | jq -r '.dashboard.version')

# Search all Organizations : https://grafana.com/docs/grafana/latest/developers/http_api/org/#search-all-organizations
orgs=$(curl -s -X GET \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	$GRAFANA_APISERVER/api/orgs)

if [ ${command} == 'add' ]; then
	org_names=(${service_name})
else
	org_names=()
fi

trimmed=${orgs#"["}
trimmed=${trimmed%"]"}

IFS='}' read -r -a elements <<< "$trimmed"

for element in "${elements[@]}"; do
	element="${element}}"
	element=${element#","}
    name=$(echo "${element}" | jq -r ".name")
	
	if [ ${name} != "Admin" -a ${name} != "Guest" -a ${name} != ${service_name} ]; then
		org_names+=(${name})
	fi
done

input_file="templates/update_service_json.template"
output_file="new/service_modified.json"
input_panel_file="templates/update_service_json.panel.template"
output_panel_file="tmp/update_service_json.panel.output"
temp_file="tmp/update_service_json.tmp"
temp_file2="tmp/update_service_json.tmp2"
temp_file3="tmp/update_service_json.tmp3"
temp_file4="tmp/update_service_json.tmp4"

create_json() {
	old_word='\"$id\"'
	new_word="${id}"

	sed "s/${old_word}/${new_word}/g" "${input_file}" > "${temp_file}"

	old_word='$uid'
	new_word="${uid}"

	sed "s/${old_word}/${new_word}/g" "${temp_file}" > "${temp_file2}"

	old_word='\"$version\"'
	new_word="${version}"

	sed "s/${old_word}/${new_word}/g" "${temp_file2}" > "${temp_file}"

	count=0
	curr=0
	arr_count=${#org_names[@]}

	for service_name in "${org_names[@]}"
	do
		old_word='$service_name'
		new_word="${service_name}"

		sed "s/${old_word}/${new_word}/g" "${input_panel_file}" > "${temp_file3}"

		old_word='\"$title_y\"'
		new_word="${count}"

		sed "s/${old_word}/${new_word}/g" "${temp_file3}" > "${temp_file4}"
		count=$((count + 1))

		old_word='\"$dashboard_y\"'
		new_word="${count}"

		sed "s/${old_word}/${new_word}/g" "${temp_file4}" >> "${output_panel_file}"

		if [ "${arr_count}" -ne "$((curr + 1))" ]; then
			echo "," >> "${output_panel_file}"
		fi

		count=$((count + 5))
		curr=$((curr + 1))

	done

	sed "22r ${output_panel_file}" ${temp_file} > ${output_file}

	rm "${temp_file}"
	rm "${temp_file2}"	
	rm "${temp_file3}"
	rm "${temp_file4}"
	rm "${output_panel_file}"
}

create_json

# Create / Update dashboard : https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#create--update-dashboard
curl -s -X POST \
	-H "Accept: application/json" \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${basic_token}" \
	-d "$(cat ${output_file})" \
	$GRAFANA_APISERVER/api/dashboards/db