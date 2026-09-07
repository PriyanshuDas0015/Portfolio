export const list =
  (Model, options = {}) =>
  async (req, res) => {
    let query = Model.find();
    if (options.populate) query = query.populate(options.populate);
    const items = await query.sort(options.sort || { displayOrder: 1, createdAt: 1 }).lean();
    res.json({ success: true, items });
  };
export const create = (Model) => async (req, res) => {
  const item = await Model.create(req.validated);
  res.status(201).json({ success: true, item });
};
export const update = (Model) => async (req, res) => {
  const item = await Model.findByIdAndUpdate(req.params.id, req.validated, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
  res.json({ success: true, item });
};
export const remove = (Model) => async (req, res) => {
  const item = await Model.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
  res.json({ success: true });
};
