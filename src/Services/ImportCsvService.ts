import api from "../axios/interceptor";


export async function importData(type: string,data: any) {
  return api.post(`import-csv/`, data, {params:{type}});
}
