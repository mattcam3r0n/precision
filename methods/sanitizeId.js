sanitizeId = function(id) {
    const sanitizedId = id._str
      ? new Mongo.ObjectID(id._str)
      : id;
    return sanitizedId;
};
