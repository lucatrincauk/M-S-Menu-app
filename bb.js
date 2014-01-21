(function(){
  window.App = {
    Models: {},
    Collections: {},
    Views: {}
  };
  //Template recalling
  window.template = function(id) {
    return _.template( $('#' + id).html() );
  };

  // Product model
  App.Models.Product = Backbone.Model.extend({
    // Default values for empty model
   
  });
  // Products Collection model
  App.Collections.Products = Backbone.Collection.extend({
      model: App.Models.Product,
      url: 'data.json'
  });


  // Products Collection view
  App.Views.Products = Backbone.View.extend({
    tagName: 'ul',
    render: function(){ //render the collection view
        this.collection.each(function(product){ //for each model in the collection..
          var productView = new App.Views.Product({ model: product }); //..assign it to a view
          this.$el.append(productView.render().el);
      }, this);
      return this;    
    }
  });

  // Product View
  App.Views.Product = Backbone.View.extend({
    tagName: 'li',
    className: 'product col-sm-6 col-md-6',
    template: template('productTemplate'),
    render: function() { //render the model view

      this.$el.html( this.template(this.model.toJSON()) ); //attach the data to the template
      return this;
    }
  });

  //Raw data
  var productList = new App.Collections.Products();


  //Load products from JSON feed
  productList.fetch({
    success: function (productList) {
          var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var today = new Date();
    var day = days[today.getDay()];  
  var filtered = _(productList.where({day: day}));
  $('.date').html(day);

  // console.log(productList);
//    this.collection.where

     var productListView = new App.Views.Products({ collection: filtered }); //Match list View with a collection 
      $('.productContainer').html(productListView.render().el); //Append result to the page
      Backbone.history.loadUrl(); //load the correct product if specified
    }
  });
  
  // //Router
  // App.Router = Backbone.Router.extend({
  //     initialize: function() {
  //       Backbone.history.start();
      
  //   },
  //   //specify all available routes
  //   routes: {
  //     '': 'index', //plp
  //     'clothing': 'clothing'
  //     },
  //   //Index route
  //   index: function() {
  //     console.log('You\'re viewing the homepage');    
       
  //     $('.productContainer').html(productListView.render().el); //Append result to the page
  //   },
  //       //Index route
  //   clothing: function(category) {
  //     var productListView = new App.Views.Products({ collection: productList }); //Match list View with a collection 
  //     $('.productContainer').html(productListView.render().el); //Append result to the page
  //   }
  // });
  // new App.Router; //start everything  
  // //Backbone.history.start(); //enable history
})();