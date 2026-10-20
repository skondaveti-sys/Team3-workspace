export const toOutageDto = (outage) => ({
  id: outage.id,
  station: outage.station,
  description: outage.description,
});