export const dva = {
  config: {
    /**
     * https://dvajs.com/api/#onerror-err-dispatch
     * @param e
     */
    onError(e) {
      console.error(e.message);
    },
  },
};
