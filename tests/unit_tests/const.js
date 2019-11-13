export const DB_LIKE_OBJECT = {
  transaction: () => {}
};

export const FAILING_DB_LIKE_OBJECT = {
  transaction: () => {throw new Error()}
};
