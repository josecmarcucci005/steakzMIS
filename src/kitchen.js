
var restaurant = null;

var urlRest = 'https://steakz-0eef.restdb.io/rest/restaurant';

var loadingList = true;
var loadingRestList = true;

function makeAxiosCallGet(url, temp, func) {
  try {
    axios.get(url, {
        headers: {
          'content-type': 'application/json',
          'x-apikey': '5f9f1f94231ba42851b4a04b',
          'cache-control': 'no-cache'
        },
        async: true,
        crossDomain: true,
        responseType: 'json',
        timeout: 30000
      })
      .then(function(response) {
        func(response, temp)
      })
      .catch(function(error) {
        console.log(error);
      })
  } catch (error) {
    console.log(error)
  }
};

function makeAxiosCallPut(url, obj, temp, func) {
  try {
    var putUrl = url + '/' + obj._id;
    axios.put(putUrl, obj, {
        headers: {
          'content-type': 'application/json',
          'x-apikey': '5f9f1f94231ba42851b4a04b',
          'cache-control': 'no-cache'
        },
        async: true,
        crossDomain: true,
        responseType: 'json',
        timeout: 30000
      })
      .then(function(response) {
        func(response, temp)
      })
      .catch(function(error) {
        console.log(error);
      })
  } catch (error) {
    console.log(error)
  }
};

function makeAxiosCallPatch(url, id, temp, params, func) {
  try {
    var putUrl = url + '/' + id;
    axios.patch(putUrl, params, {
        headers: {
          'content-type': 'application/json',
          'x-apikey': '5f9f1f94231ba42851b4a04b',
          'cache-control': 'no-cache'
        },
        async: true,
        crossDomain: true,
        responseType: 'json',
        timeout: 30000
      })
      .then(function(response) {
        func(response, temp)
      })
      .catch(function(error) {
        console.log(error);
      })
  } catch (error) {
    console.log(error)
  }
};

function makeAxiosCallPush(url, obj, router, func) {
  try {
    axios.post(url, obj, {
        headers: {
          'content-type': 'application/json',
          'x-apikey': '5f9f1f94231ba42851b4a04b',
          'cache-control': 'no-cache'
        },
        async: true,
        crossDomain: true,
        responseType: 'json',
        timeout: 30000
      })
      .then(function(response) {
        func(response, obj, router);
      })
      .catch(function(error) {
        //console.log(error);
      })
  } catch (error) {
    console.log(error)
  }
};

function makeAxiosCallDelete(url, obj) {
  try {
    var putUrl = url + '/' + obj._id;
    axios.delete(putUrl, {
        headers: {
          'content-type': 'application/json',
          'x-apikey': '5f9f1f94231ba42851b4a04b',
          'cache-control': 'no-cache'
        },
        async: true,
        crossDomain: true,
        responseType: 'json',
        timeout: 30000
      })
      .then(function(response) {
        //console.log(JSON.stringify(response));
      })
      .catch(function(error) {
        console.log(error);
      })
  } catch (error) {
    console.log(error)
  }
};

var List = Vue.extend({
  template: '#order-list',
  data: function() {
    return {
      restaurant: restaurant,
      loadingList: true,
      activeOrders: [],
    };
  },
  mounted: function() {
    this.loadData();
  },

  methods: {
    loadData : function() {
        makeAxiosCallGet(urlRest, this, function(response, temp) {
          temp.loadingList = false;
          temp.restaurant = response.data[0];
          restaurant = temp.restaurant;

          temp.tables = [];

          for (i=1; i <= restaurant.totalTables; i++) {
            temp.tables.push(i);
          }
          
          temp.activeOrders = restaurant.orders.filter((order) => {
            return (order.status == 'IN_PROGRESS');
          })

          temp.timeout = setTimeout(()=>{
            temp.loadData()
          },30000);

        })
    },

    changeOrderStatus: function(ord, newStatus) {
      ord.status = newStatus;

      let idx = this.restaurant.orders.findIndex(x => x.id === ord.id)

      this.restaurant.orders[idx] = ord;

      makeAxiosCallPatch(urlRest, restaurant._id, this, {"orders" : restaurant.orders}, function(response, temp) {
        temp.restaurant = restaurant;

        temp.activeOrders = restaurant.orders.filter((order) => {
          return (order.status == 'IN_PROGRESS');
        })
      })
    },
    clearPolling : function() {
      clearTimeout(this.timeout);
    }
  }
});

var OrderItems = Vue.extend({
  template: '#order-items',
  data: function() {
    return {
      totalPrice: 0,
      order: {},
      loadingItemsList: true,
    };
  },
  mounted: function() {
    this.loadRestaurant();
  },
  methods: {
    loadRestaurant : function() {
      if (restaurant == null) {
        makeAxiosCallGet(urlRest, this, function(response, temp) {
          restaurant = response.data[0];

          temp.order = temp.findOrderItems(temp.$route.params.order_id);
          temp.getTotalPrice();

          temp.loadingItemsList = false;
        })
      } else {
        this.order = this.findOrderItems(this.$route.params.order_id);
        this.getTotalPrice();
        this.loadingItemsList = false;
      }
    },

    findOrderItems : function(orderId) {
      if (restaurant == null) {
        return;
      }
      return this.findOrderKey(orderId);
    },
    
    findOrderKey : function(orderId) {
      for (var key = 0; key < restaurant.orders.length; key++) {
        if (restaurant.orders[key].id == orderId) {
          return restaurant.orders[key];
        }
      }
    },

    getTotalPrice : function() {
      if (restaurant == null) {
        return;
      }

      if (this.order == null) {
        return;
      }

      this.totalPrice = 0;

      for (key = 0; key < this.order.items.length; key++) {
        this.totalPrice += (this.order.items[key].quantity * this.order.items[key].price)
      }
    },
  }
});

var vm = new Vue({ 
	el: '.app',
})

var router = new VueRouter({
  routes: [{
      path: '/orders',
      component: List
    },
    {
      path: '/orders/:order_id/orderView',
      component: OrderItems,
      name: 'order-items'
    }
  ]
});


var App = {
  
}

new Vue({
  data: function() {
    return {
      menuEle: [{'active':true}, {'active':false}, {'active':false}, {'active':false}]
    };
  },
  methods: {
    changeClass : function(idx) {
      for (i=0; i < this.menuEle.length; i++) {
        if (i == idx) {
          this.menuEle[i].active = true;
        } else {
          this.menuEle[i].active = false;
        }
      }
    }
  }, 
  
  router
}).$mount('#app')
