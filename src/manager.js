
/**
var foods = [
  {id: 1, name: 'Ribeye Steak', description: 'Beef steak from the rib section', price: 25},
  {id: 2, name: 'Flank Steak', description: 'Beef taken from the abdominal muscles or lower chest of the steer', price: 27},
  {id: 3, name: 'Sirloin Steak', description: 'Sirloin steak comes from the rear back portion of the cow, and comes in two parts; the top sirloin and the bottom sirloin.', price: 30}
];
*/

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
  template: '#food-list',
  data: function() {
    return {
      foods: foods,
      searchKey: '',
      loadingList: true
    };
  },
  mounted: function() {
    if (foods.length == 0) {
      makeAxiosCallGet(urlFood, this, function(response, temp) {
        temp.loadingList = false;
        temp.foods = response.data;
        foods = temp.foods;
      });
    } else {
      this.loadingList = false;
    }
  },
  computed: {
    filteredFoods() {
      return this.foods.filter((food) => {
        return food.name.indexOf(this.searchKey) > -1
        //return !food.name.indexOf(this.searchKey)
      })
    }
  }
});

var Food = Vue.extend({
  template: '#food',
  data: function() {
    return {
      food: findFood(this.$route.params.food_id)
    };
  }
});

var FoodEdit = Vue.extend({
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

var FoodDelete = Vue.extend({
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

var AddFood = Vue.extend({
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

var Rest = Vue.extend({
  template: '#restaurant',
  data: function() {
    return {
      restaurant: restaurant,
      searchKey: '',
      loadingRestList: true,
      showTableAlert: false
    };
  },
  mounted: function() {
      makeAxiosCallGet(urlRest, this, function(response, temp) {

        temp.loadingRestList = false;
        temp.restaurant = response.data[0];
        restaurant = temp.restaurant;

      });
  },
  methods: {
      updateTables: function() {
        
        makeAxiosCallPatch(urlRest, restaurant._id, this, {"totalTables" : restaurant.totalTables}, function(response, temp) {
          //console.log(JSON.stringify(response));

          temp.showTableAlert = true;

          setTimeout(()=>{
            temp.showTableAlert = false;
          },2000);
        })
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
    console.log(JSON.stringify(restaurant));
    
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

var Overview = Vue.extend({
  template: '#overview',
  data: function() {
    return {
      restaurant: restaurant,
      loadingOverview: true, 
      lastOrders: []
    };
  },
  mounted: function() {
    makeAxiosCallGet(urlRest, this, function(response, temp) {
      temp.loadingOverview = false;
      temp.restaurant = response.data[0];
      restaurant = temp.restaurant;

      temp.lastOrders = restaurant.orders;

      temp.lastOrders.sort(temp.sortByProperty('date'));

      temp.lastOrders = temp.lastOrders.slice(0, 9)

      temp.lastOrders.reverse();
    });
  },
  methods: {
    sortByProperty: function(date) {
      return function(a, b) {
        if (a[date] > b[date]) {
          return 1;
        }  
        else if (a[date] < b[date]) {
          return -1;
        }
        return 0;
      }
    }
  }  
});

Vue.component('pie-chart', {
	extends: VueChartJs.Pie,
	data: function () {
    return {
      colors : [ '#1E9600', '#99C802', '#FFF200', '#F89403',	'#FF0000' ],
      datacollection: {
				labels: [],
				datasets: [
					{
						backgroundColor: [],
						data: [],
					},
				],
			},
			options: {
				responsive: true,
				legend: {
					display: true,
					position: 'right',
        } 
      },
      restaurant: restaurant,
      loadingPie: true,
		}
	},
	mounted () {
    // this.chartData is created in the mixin
    if (restaurant == null) {
      makeAxiosCallGet(urlRest, this, function(response, temp) {
        temp.restaurant = response.data[0];
        restaurant = temp.restaurant;
        temp.loadingPie = false;

        temp.groupFood();

        temp.renderChart(temp.datacollection, temp.options);
      });
    } else {
      this.loadingPie = false;

      this.groupFood();

      this.renderChart(this.datacollection, this.options);
    }
	},
  methods: {    
    groupFood: function() {
      var foodGroup = []; 

      for (i=0; i < restaurant.orders.length; i++) {
        let order = restaurant.orders[i];

        for (j=0; j < order.items.length; j++ ) {
          let item = order.items[j];

          let f = foodGroup.find(i => {
            return i.name == item.name
          });

          console.log('Here again' + JSON.stringify(f));
          
          if (f == null) {
            f = {name : item.name, quantity : item.quantity}
            foodGroup.push(f);
          } else {
            f.quantity += item.quantity; 
          }
        }
      }
      foodGroup.sort(this.sortByProperty('quantity')).slice(0, 5);

      let sum = foodGroup.map(o => o.quantity).reduce((a, c) => { return a + c });

      for (i=0; i < foodGroup.length; i++) { 
        this.datacollection.labels.push(foodGroup[i].name);

        this.datacollection.datasets[0].backgroundColor.push(this.colors[i]);
        this.datacollection.datasets[0].data.push(foodGroup[i].quantity/sum*100);
      } 


      return foodGroup;
    },

    sortByProperty: function(quantity) {
      return function(a, b) {
        if (a[quantity] > b[quantity]) {
          return 1;
        }  
        else if (a[quantity] < b[quantity]) {
          return -1;
        }
        return 0;
      }
    }
  }
});

var vm = new Vue({ 
	el: '.app',
})

var router = new VueRouter({
  routes: [{
      path: '/food',
      component: List
    },
    {
      path: '/food/:food_id',
      component: Food,
      name: 'food'
    },
    {
      path: '/add-food',
      component: AddFood
    },
    {
      path: '/food/:food_id/edit',
      component: FoodEdit,
      name: 'food-edit'
    },
    {
      path: '/food/:food_id/delete',
      component: FoodDelete,
      name: 'food-delete'
    }, 
    {
      path: '/restaurant',
      component: Rest
    },
    {
      path: '/restaurant/:order_id/orderView',
      component: OrderItems,
      name: 'order-items'
    },
    {
      path: '/',
      component: Overview
    }
  ]
});


var App = {
  
}

new Vue({
  data: function() {
    return {
      menuEle: [{'active':true}, {'active':false}, {'active':false}, {'active':false}],
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
