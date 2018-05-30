sanitizeId = function(id) {
  const sanitizedId = id && id._str ? new Mongo.ObjectID(id._str) : id;
  return sanitizedId;
};

normalizeId = function(id) {
  if (id && id._str) return id._str;
  return id;
};
