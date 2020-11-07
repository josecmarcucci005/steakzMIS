
/**
var foods = [
  {id: 1, name: 'Ribeye Steak', description: 'Beef steak from the rib section', price: 25},
  {id: 2, name: 'Flank Steak', description: 'Beef taken from the abdominal muscles or lower chest of the steer', price: 27},
  {id: 3, name: 'Sirloin Steak', description: 'Sirloin steak comes from the rear back portion of the cow, and comes in two parts; the top sirloin and the bottom sirloin.', price: 30}
];
*/

var foods = [];

var urlFood = 'https://steakz-0eef.restdb.io/rest/food';

var loadingList = true;

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
        //console.log(error);
      })
  } catch (error) {
    console.log(error)
  }
};

function makeAxiosCallPut(url, obj) {
  try {
    var putUrl = url + '/' + obj._id;
    axios.put(putUrl, food, {
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
      router.push('/');
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
      router.push('/');
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

        router.push('/');
      });
    }
  }
});

var router = new VueRouter({
  routes: [{
      path: '/',
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
    }
  ]
});


var App = {
}

new Vue({
  router
}).$mount('#app')
