export interface VehicleMakesResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: Array<{
    MakeId: number;
    MakeName: string;
    VehicleTypeId: number;
    VehicleTypeName: string;
  }>;
}

export interface VehicleModelsResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: Array<{
    Make_ID: number;
    Make_Name: string;
    Model_ID: number;
    Model_Name: string;
  }>;
}
