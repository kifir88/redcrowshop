interface Config {
  PAGES: {
    [key: string]: string;  // Indicates any key is a string that maps to a string
    shipping: string;
    about: string;
    oferta: string;
    confidential: string;
    payment_error: string;
    payment_success: string;
  };
}

const config: Config = {
  PAGES: {
    shipping: "16495",
    about: "16497",
    oferta: "16492",
    confidential: "16499",
    payment_error: "16506",
    payment_success: "16508"
  }
};

export default config;