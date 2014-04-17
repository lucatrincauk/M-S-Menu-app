(function(){
  window.App = { //Defining namespaces
    Models: {},
    Collections: {},
    Views: {}
  };

  window.template = function(id) { //Linking the templates
    return _.template( $('#' + id).html() );
  };

  // Product model
  App.Models.Product = Backbone.Model.extend({   
    defaults: { // Setting defaults for empty models
      "soup1": "-",
      "soup2": "-",
      "theatreBar": "-",
      "bistro": "-",
      "classic": "-",
      "vegetarian": "-",
      "plain": "-",
      "traditional": "-",
      "rotisserie": "-",
      "accompaniments": "-"
    }   
  });
  // Products Collection
  App.Collections.Products = Backbone.Collection.extend({
      model: App.Models.Product, // Linking the model
      url: 'data.json' // Linking the data
  });

  // Products Collection view
  App.Views.Products = Backbone.View.extend({
    tagName: 'ul', // Defining DOM element
    render: function(){ // Render function
        this.collection.each(function(product){ // Products loop
          var productView = new App.Views.Product({ model: product }); // Assign product to the view
          this.$el.append(productView.render().el); // Render the view
      }, this);
      return this;    
    }
  });

  // Product View
  App.Views.Product = Backbone.View.extend({
    tagName: 'li',
    className: 'product col-sm-6 col-md-6', // Defining DOM class name
    template: template('productTemplate'),
    render: function() { //render the model view
    
      var dayN = this.model.get('day');

      $('.prev').attr('href', '#day/' + (dayN - 1));
      $('.next').attr('href', '#day/' + (dayN + 1));
      this.$el.html( this.template(this.model.toJSON()) ); //attach the data to the template
      var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      if (dayN > 0 && dayN <=5) {        
        $('nav a').removeAttr('disabled');
        if (dayN == 1) {
          $('.prev').attr('disabled', 'disabled');
        } else if (dayN == 5) {
          $('.next').attr('disabled', 'disabled');
        }       
      } 

      $('.date').html(days[dayN]);
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
      var day = today.getDay();  
      var filtered = _(productList.where({day: day}));
      $('.date').html(days[day]);

      var productListView = new App.Views.Products({ collection: filtered }); //Match list View with a collection 
      $('.productContainer').html(productListView.render().el); //Append result to the page
      Backbone.history.loadUrl(); //load the correct product if specified
    }
  });
  
  //Router
  App.Router = Backbone.Router.extend({
    initialize: function() {
      Backbone.history.start();      
    },
    //specify all available routes
    routes: {
      'day/:id': 'day'
      },
    day: function(id) {
      id = parseInt(id);        
      var filtered = _(productList.where({day: id}));
      var productListView = new App.Views.Products({ collection: filtered }); //Match list View with a collection 
      $('.productContainer').html(productListView.render().el); 

    }
  });
  new App.Router; //start everything  
})();