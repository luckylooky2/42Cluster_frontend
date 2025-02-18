#! /bin/bash

basic_token=$(echo -n "$GRAFANA_ADMIN_ID:$GRAFANA_ADMIN_PW" | base64)

bash delete_dashboard.sh mfd1d0c121a264efa8644b636a3f509a # cluster.json
bash delete_dashboard.sh m0c121a26444b636a3fd509a8efa86fd # node.json
bash delete_dashboard.sh m78cdf77779eaa1add43ccec1e5a5620 # node-detail.json
bash delete_dashboard.sh md0c121a26444b636a3f509a8efa86fd # namespace.json
bash delete_dashboard.sh m5a562078cdf77779eaa1add43ccec1e # namespace-detail.json
bash delete_dashboard.sh mb0d919ec0ea5f6543124e16c42a5a87 # service-summary.json

bash delete_dashboard.sh d595cac94cda1b36fc103b78a9e33f47 # overview.json
bash delete_dashboard.sh d87670baea6a8ba5d368cd85bef0fbd3 # application.json

bash delete_dashboard.sh a70baea6a8ba5d368cd85bef0fbd3876 # configmap-modification-failure.json
bash delete_dashboard.sh a0baea6a8ba5d368cd85bef0fbd38767 # secret-access.json
bash delete_dashboard.sh abaea6a8ba5d368cd85bef0fbd387670 # secret-modification.json