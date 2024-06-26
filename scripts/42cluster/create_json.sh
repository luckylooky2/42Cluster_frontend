#! /bin/bash

service_name=$1

if [ -z "${service_name}" ]; then
    echo "No arguments: create json."
    exit 1
fi

mkdir -p tmp
mkdir -p new

generate_hash() {
	curr_time=$(date +%s)
    temp_file="${curr_time}.tmp"
    echo ${curr_time} > "${temp_file}"
    hash=$(md5sum "$temp_file" | cut -d ' ' -f1)
    rm "${temp_file}"
    echo "m${hash:0:31}"
}

create_json() {
	input_file="templates/create_json.template"
	temp_file="tmp/${service_name}.tmp"
	output_file="new/${service_name}.json"

	old_word='$namespace'
	new_word="${service_name}"

	sed "s/${old_word}/${new_word}/g" "${input_file}" > "${temp_file}"

	old_word='$uid'
	new_word="${uid}"

	sed "s/${old_word}/${new_word}/g" "${temp_file}" > "${output_file}"
	rm "${temp_file}"
}

uid=$(generate_hash)
create_json


