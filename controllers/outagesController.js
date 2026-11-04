import * as outagesService from '../services/outagesService.js';

export const index = async (req, res) => {
  const outages = await outagesService.listOutages();
  res.status(200).render('outages', { title: 'Report an outage', outages });
};

export const create = async (req, res) => {
  const result = await outagesService.createOutage(req.body);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  if (req.get('HX-Request')) {
    res.status(201).render('partials/outage-item', { outage: result.value });
    return;
  }
  res.status(201).json(result.value);
};