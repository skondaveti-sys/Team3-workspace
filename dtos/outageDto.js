export const toOutageDto = (outage) => ({
  id: outage._id.toString(),
  station: outage.station,
  description: outage.description,
});
