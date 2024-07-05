![42cluster Logo](public/img/42Cluster/banner-icon.png)
![42cluster Logo](public/img/42Cluster/banner.png)

## Introduction

Kubernetes(k8s)에 최적화된 monitoring 및 observability 서비스를 제공하는 프로젝트입니다.

이 프로젝트는 [Grafana 오픈 소스 소프트웨어(v10.4.0)](https://github.com/grafana/grafana/tree/v10.4.0)를 기반으로 커스터마이징하여 개발되었습니다. Grafana의 강력한 데이터 시각화 기능을 바탕으로, [42Cluster 프로젝트](https://github.com/42Cluster-Seoul)의 요구 사항에 맞추어 다양한 기능과 개선 사항을 추가했습니다.

## Extra Features

### k8s 대시보드

- **Metric:** 클러스터, 노드, 네임스페이스 세 관점에서 k8s 주요 자원의 메트릭 정보를 수집하는 대시보드입니다.

- **Security:** k8s의 중요 정보를 관리하는 자원에 접근 또는 수정하려는 시도를 수집 및 분석한 대시보드입니다.

- **Deployment:** ArgoCD를 통해 배포중인 모든 서비스의 종합 배포 정보를 보여주는 대시보드입니다.

- **대시보드 스크립트:** CLI 환경에서 대시보드 추가, 제거 스크립트를 통해 쉽게 대시보드를 관리할 수 있습니다.

### 대시보드 컨트롤 바

- **대시보드 관련 UI 통합:** 여러 곳에 흩어져있던 대시보드 관련 UI를 하나의 컴포넌트로 모아 접근성을 강화했습니다.

- **대시보드 드롭다운 메뉴:** 현재 대시보드에서 다른 대시보드로 이동할 수 있는 드롭다운 메뉴를 추가하여, 뒤로가기를 하지 않고도 한 번에 다른 대시보드에 접근할 수 있습니다.

- **다중 선택 칩:** 현재 다중 선택된 대시보드 변수를 쉽게 확인하고 필요에 따라 수정할 수 있습니다.

- **리셋 버튼:** 대시보드 데이터의 시간 범위, 필터링 등을 변경했을 때 다시 초기 설정으로 되돌리는 버튼을 추가하였습니다.

## Get Started

1. `helm`을 이용하여 `prometheus` 스택 구성

2. `grafana` 이미지를 아래 이미지로 교체

   - [`chanhyle/grafana-oss`](https://hub.docker.com/repository/docker/chanhyle/grafana-oss/general)

3. 레포지토리를 다운 받은 후, `scripts/42cluster`로 이동

   ```shell
   git clone https://github.com/42Cluster-Seoul/frontend.git
   cd frontend/scripts/42cluster
   ```

4. `env.sh` 파일 생성 및 적용

   ```shell
   cat << EOF > env.sh
   export GRAFANA_APISERVER=your_grafana_apiserver_url
   export PROMETHEUS_SERVER=your_prometheus_server_url
   export GRAFANA_ADMIN_ID=your_grafana_admin_id
   export GRAFANA_ADMIN_PW=your_grafana_admin_password
   export AWS_ACCESS_KEY_ID=your_aws_access_key_id
   export AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   EOF
   source env.sh
   ```

5. `init.sh` 실행

   ```shell
   bash init.sh
   ```

## License

이 프로젝트 및 Grafana는 [AGPL-3.0-only](LICENSE) 라이선스 하에 배포됩니다. Apache-2.0 예외 사항에 대해서는 [LICENSING.md](https://github.com/grafana/grafana/blob/HEAD/LICENSING.md)를 참조하시길 바랍니다.
