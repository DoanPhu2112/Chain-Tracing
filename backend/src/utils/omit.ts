const omitIsNil = (obj: unknown, options = { deep: false }) => {
  const { deep } = options;
  if (typeof (obj) !== 'object' || !obj) return {};

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof object] === undefined || obj[key as keyof object] === null) {
      delete obj[key as keyof object];
    }
  })

  if (deep) {
    Object.keys(obj).forEach((key) => {
      if (typeof (obj[key as keyof object]) === 'object') {
        omitIsNil(obj[key as keyof object], { deep: true });
      }
    })
  }
  return obj;
}

export default omitIsNil