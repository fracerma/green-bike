import homeComponent from "./components/homeComponent.js"
import profileComponent from "./components/profile.js"
import newJourney from "./components/newJourney.js"
import ecocredits from "./components/ecocredits.js"
Vue.use(VueRouter);
Vue.use(Vuetify);

const router = new VueRouter({
    routes:[
            {path:"/",name:"Home", component: homeComponent },
            {path:"/profile",name:"Profile", component: profileComponent},
            {path:"/newJourney",name:"New Journey", component: newJourney},
            {path:"/ecocredits",name:"ecocredits", component: ecocredits},
            //{ path: "*", component: PageNotFound }
    ]
});

const apikey= fetch("http://localhost:5000/apiKey")
    .then(res=>res.json())
    .then((data)=>{
        Vue.use(VueGoogleMaps, {
            load: {
              key: data.apiKey,
              libraries: 'places,drawing,geometry',
              installComponents: true
            }
          });
    })

const app=new Vue({
    el: '#app',
    router,
    vuetify: new Vuetify(),
    components:{
        homeComponent,
        profileComponent,
        newJourney
       
    },
    data:{
        drawer: false,
        items: [],
        user: null
    },
    beforeCreate(){
        fetch("http://localhost:5000/api/users")
        .then(response => response.json())
        .then(data => {
            this.user=data;
            let items;
            if(this.user.role==="premium"){
                items=[
                    { title: 'Dashboard', icon: 'mdi-view-dashboard', link:"/" },
                    { title: 'Il tuo profilo', icon: 'mdi-account' , link:"/profile"},
                    { title: 'I tuoi percorsi', icon: 'mdi-directions-fork', link:"/journey" },
                    { title: 'I tuoi obbiettivi', icon: 'mdi-bike', link:"/progress" },
                    { title: 'I tuoi ecocrediti', icon: 'mdi-currency-eur', link:"/ecocredits" },
                    { title: 'I tuoi acquisti', icon: 'mdi-shopping' , link:"/purchase"},
                    { title: 'Community', icon: 'mdi-share-variant', link:"/community" },
                    { title: 'Gestione sensore', icon: 'mdi-gauge', link:"/sensor" }
                  ];
            }else{
                items=[
                { title: 'Dashboard', icon: 'mdi-view-dashboard', link:"/" },
                { title: 'Il tuo profilo', icon: 'mdi-account' , link:"/profile"},
                { title: 'I tuoi percorsi', icon: 'mdi-directions-fork', link:"/journey" },
                { title: 'I tuoi obbiettivi', icon: 'mdi-bike', link:"/progress" }]
            }
            
            this.items=items;
        });
    },
  })