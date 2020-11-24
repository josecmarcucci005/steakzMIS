
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

function makeAxiosCallPut(url, obj) {
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
        //console.log(JSON.stringify(response));
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
        //console.log(error);
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
      searchKey: ''
    };
  },
  mounted: function() {
    if (restaurant == null) {
      makeAxiosCallGet(urlRest, this, function(response, temp) {
        temp.loadingList = false;
        temp.restaurant = response.data;
        restaurant = temp.restaurant;
        
        temp.activeOrders = restaurant[0].orders.filter((order) => {
          return (order.status == 'OPEN' || order.status == 'IN_PROGRESS' || order.status == 'READY');
        })
      });
    } else {
      this.loadingList = false;

      this.activeOrders = restaurant.orders;

      this.activeOrders.filter((order) => {
        return (order.status == 'OPEN' || order.status == 'IN_PROGRESS' || order.status == 'READY');
      })
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
  methods: {
    createOrder : function() {
      let foodItems = this.foods.filter((food) => {
        return food.quantity > 0
      });

      var newOrder = {id: restaurant.orders.length, tableNumber}
    }
  },
  computed: {
    filteredFoods() {
      return this.foods.filter((food) => {
        if (food.quantity == null) {
          food.quantity = 0;
        }
        return food.name.indexOf(this.searchKey) > -1
        //return !food.name.indexOf(this.searchKey)
      })
    }
  }
});

var Order = Vue.extend({
  template: '#food',
  data: function() {
    return {
      food: findFood(this.$route.params.food_id)
    };
  }
});

var OrderEdit = Vue.extend({
  template: '#food-edit',
  data: function() {
    return {
      food: findFood(this.$route.params.food_id)
    };
  },
  methods: {
    updateFood: function() {
      let food = this.food;
      foods[findFoodKey(food.id)] = {
        _id: food._id,
        id: food.id,
        name: food.name,
        description: food.description,
        price: food.price
      };

      makeAxiosCallPut(urlFood, food);
      router.push('/food');
    }
  }
});

var OrderDelete = Vue.extend({
  template: '#food-delete',
  data: function() {
    return {
      food: findFood(this.$route.params.food_id)
    };
  },
  methods: {
    deleteFood: function() {
      foods.splice(findFoodKey(this.$route.params.food_id), 1);
      makeAxiosCallDelete(urlFood, this.food);
      router.push('/food');
    }
  }
});

var AddOrder = Vue.extend({
  template: '#add-food',
  data: function() {
    return {
      food: {
        name: '',
        description: '',
        price: ''
      }
    }
  },
  methods: {
    createFood: function() {
      let food = this.food;
      makeAxiosCallPush(urlFood, food, router, function(response, food, router) {
        food.id = response.data.id;
        food._id = response.data._id;

        foods.push(food);

        router.push('/food');
      });
    }
  }
});

var OrderItems = Vue.extend({
  template: '#order-items',
  data: function() {
    var res = this.loadRestaurant();

    return {
      order: this.findOrderItems(this.$route.params.order_id),
      totalPrice: this.getTotalPrice(this.$route.params.order_id),
      backTo: this.$route.params.back_to,
      loadingItemsList: res,
    };
  },
  mounted: function() {
    
  },
  methods: {
    loadRestaurant : function() {
      if (restaurant == null) {
        makeAxiosCallGet(urlRest, this, function(response, temp) {
          restaurant = response.data[0];

          temp.order =  temp.findOrderItems(temp.$route.params.order_id);
          temp.totalPrice = temp.getTotalPrice(temp.$route.params.order_id);
          temp.backTo =  '/';

          temp.loadingItemsList = false;
        });
      } else {
        return false;
      }
      return true;
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

    getTotalPrice : function(orderId) {
      if (restaurant == null) {
        return;
      }
      var totalPrice = 0;
      var order = this.findOrderItems(orderId)
      for (var key = 0; key < order.items.length; key++) {
        totalPrice += totalPrice + (order.items[key].quantity * order.items[key].price)
      }
      return totalPrice;
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
							<button type="button" class="btn btn-primary" @click="createOrder()">Create Order</button>
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
      path: '/order/:order_id',
      component: Order,
      name: 'order'
    },
    {
      path: '/order-add',
      component: AddOrder
    },
    {
      path: '/order/:order_id/edit',
      component: OrderEdit,
      name: 'order-edit'
    },
    {
      path: '/order/:order_id/delete',
      component: OrderDelete,
      name: 'order-delete'
    },
    {
      path: '/restaurant/:order_id/orderView',
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
