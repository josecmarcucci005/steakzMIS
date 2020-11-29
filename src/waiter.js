
var foods = [];
var restaurant = null;

var urlFood = 'https://steakz-0eef.restdb.io/rest/food';
var urlRest = 'https://steakz-0eef.restdb.io/rest/restaurant';

var loadingList = true;
var loadingRestList = true;

function findFood(foodId) {
  return foods[findFoodKey(foodId)];
};

function findFoodKey(foodId) {
  for (var key = 0; key < foods.length; key++) {
    if (foods[key].id == foodId) {
      return key;
    }
  }
};

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
      loadingListFood: true,
      activeOrders: [],
      showModal : false,
      foods: foods,
      searchKey: '',
      tables: [],
      order: {tableNumber:1}
    };
  },
  mounted: function() {
    this.loadData();

    if (foods.length == 0) {
      makeAxiosCallGet(urlFood, this, function(response, temp) {
        temp.loadingListFood = false;
        temp.foods = response.data;
        foods = temp.foods;
      });
    } else {
      this.loadingListFood = false;
    }
  },
  methods: {
    loadData : function() {
      if (this.showModal == false) {
        makeAxiosCallGet(urlRest, this, function(response, temp) {
          temp.loadingList = false;
          temp.restaurant = response.data[0];
          restaurant = temp.restaurant;

          temp.tables = [];

          for (i=1; i <= restaurant.totalTables; i++) {
            temp.tables.push(i);
          }
          
          temp.activeOrders = restaurant.orders.filter((order) => {
            return (order.status == 'OPEN' || order.status == 'IN_PROGRESS' || order.status == 'READY');
          })

          temp.timeout = setTimeout(()=>{
            temp.loadData()
          },30000);

        })
      } else {
        this.timeout = setTimeout(()=>{
          this.loadData()
        },30000);
      }
    },
    resetFoods : function() {
      this.foods = foods;
    },
    createOrder : function() {
      let foodItems = this.foods.filter((food) => {
        return food.quantity > 0
      });

      this.order.items = [];

      for (i=0; i < foodItems.length; i++) {
        let f = {
                 name: foodItems[i].name,
                 price: foodItems[i].price,
                 description: foodItems[i].description,
                 id: foodItems[i].id,
                 quantity: parseInt(foodItems[i].quantity),
                }
        this.order.items.push(f);
      }

      this.order.id = restaurant.orders.length+1;
      this.order.date = new Date();
      this.order.status = 'OPEN'
      
      restaurant.orders.push(this.order);

      makeAxiosCallPatch(urlRest, restaurant._id, this, {"orders" : restaurant.orders}, function(response, temp) {
        temp.restaurant = restaurant;

        temp.showModal = false;

        router.go(router.currentRoute);
      })
    },
    onChange: function (event)
    {
      this.order.tableNumber = event.srcElement.value;
    },
    changeOrderStatus: function(ord, newStatus) {
      ord.status = newStatus;

      let idx = this.restaurant.orders.findIndex(x => x.id === ord.id)

      this.restaurant.orders[idx] = ord;

      makeAxiosCallPatch(urlRest, restaurant._id, this, {"orders" : restaurant.orders}, function(response, temp) {
        temp.restaurant = restaurant;

        temp.activeOrders = restaurant.orders.filter((order) => {
          return (order.status == 'OPEN' || order.status == 'IN_PROGRESS' || order.status == 'READY');
        })
      })
    },
    clearPolling : function() {
      clearTimeout(this.timeout);
    }
  },
  computed: {
    filteredFoods() {
      return this.foods.filter((food) => {
        if (food.quantity == null) {
          food.quantity = 0;
        }
        return food.name.indexOf(this.searchKey) > -1
      })
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
      foods: foods,
      showModal : false,
      searchKey: '',
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

      if (foods.length == 0) {
        makeAxiosCallGet(urlFood, this, function(response, temp) {
          temp.loadingListFood = false;
          temp.foods = response.data;
          foods = temp.foods;
        });
      } else {
        this.loadingListFood = false;
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
    createOrder : function() {
      for (i=0; i < foods.length; i++) {
        let idx = this.order.items.findIndex(x => x.id == foods[i].id)

        if (idx > -1) {
          if (foods[i].quantity == 0) {
            this.order.items.splice(idx, idx+1);
          } else {
            this.order.items[idx].quantity = parseInt(foods[i].quantity);
          }
        } else if (foods[i].quantity > 0) {
          let f = {
                 name: foods[i].name,
                 price: foods[i].price,
                 description: foods[i].description,
                 id: foods[i].id,
                 quantity: parseInt(foods[i].quantity),
                }
          this.order.items.push(f);
        } 
      }

      let idx = restaurant.orders.findIndex(x => x.id == this.order.id)

      restaurant.orders[idx] = this.order;

      makeAxiosCallPut(urlRest, restaurant, this, function(response, temp) {
        temp.restaurant = response.data[0];

        temp.showModal = false;

        temp.getTotalPrice();
      })
    },
  },
  computed: {
    filteredFoods() {
      return this.foods.filter((food) => {
        
        let items = this.order.items.filter((item) => {
          return item.id == food.id;
        }) 

        if (items.length > 0) {
          food.quantity = items[0].quantity;
        }

        if (food.quantity == null) {
          food.quantity = 0;
        }
        return food.name.indexOf(this.searchKey) > -1
      })
    }
  } 
});

Vue.component("modal",{
	props:['name'],
	template:`
		<div class="modal fade in modal-active">
			<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" @click="$emit('close')" class="close"><span >&times;</span></button>
							<h4 class="modal-title">
								{{name}}
							</h4>
						</div>
            <div class="modal-body">
								<slot></slot>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" @click="$emit('close')">Close</button>
							<button type="button" class="btn btn-primary" @click="$emit('create-order')">Save</button>
						</div>
				</div>
			</div>
		</div>`
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
