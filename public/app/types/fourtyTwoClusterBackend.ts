export interface FourtyTwoClusterBackendDTO {
  serviceId: number;
  serviceName: string;
  dashboardUID: string;
}

export interface FourtyTwoClusterBackendState extends FourtyTwoClusterBackendDTO {
  isValid: boolean;
}
