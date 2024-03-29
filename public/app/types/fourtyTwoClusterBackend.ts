interface FourtyTwoClusterBackendDashboard {
  uid: string;
  namespace: string;
  url: string;
}

export interface FourtyTwoClusterBackendDTO {
  serviceId: number;
  serviceName: string;
  dashboards: FourtyTwoClusterBackendDashboard[];
}

export interface FourtyTwoClusterBackendState extends FourtyTwoClusterBackendDTO {
  isValid: boolean;
}
