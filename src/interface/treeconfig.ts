export interface Irouteconfig {
  component: string;
  children: {
    default: {
      component: string;
    };
    a: {
      component: string;
    };
    b: {
      component: string;
    };
  };
}

export interface Itreeconfig {
  home: Irouteconfig;
  earthquake: Irouteconfig;
  flood: Irouteconfig;
  typhoon: Irouteconfig;
}
