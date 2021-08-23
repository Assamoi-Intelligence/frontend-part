export interface Order {
  id: number;
  clientnumber: string,
  locationlatitude: number,
  locationlongitude: number,
  timewindowstart: string | Date | number,
  timewindowend: string | Date | number,
  productquantity: number
}
