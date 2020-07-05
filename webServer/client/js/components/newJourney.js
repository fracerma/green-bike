
export default {
    template: `
    <div>
        <div class="input-pos">
            <span> Destinazione: </span>
            <gmap-autocomplete class="introInput"  @place_changed="searchRoutes" ></gmap-autocomplete>
        </div>
        <div class="center-div">
            <v-overlay
                :absolute="absolute"
                :value="loading"
                >
                    <v-progress-circular
                    :width="5"
                    color="green"
                    indeterminate
                    v-if="loading"
                ></v-progress-circular>
                </v-overlay>
            <gmap-map :center="center" :zoom="12" style="width: 100%; height: 500px"" >
                <gmap-marker v-if="markerDestination" :position="markerDestination" ></gmap-marker>
                <gmap-marker :position="center"></gmap-marker>
                <gmap-polyline v-for="(route,index) in routes.routes"
                :path="decode(route.overview_polyline.points)" ref="polyline" @click="select(index)" v-bind:options="{ strokeColor:(routes.healthier===index)?'#00FF00':'#ff0000ff', strokeWeight: (selected&&selected===index)?9:7, strokeOpacity: (selected===index)?0.8: 0.4}">
                </gmap-polyline>
            </gmap-map>
            <span v-html="description"></span>
            <button @click="startJourney()" :disabled="disabled" class="btn btn-success"> Start </button>
        </div>
    </div>
    `,
    computed: {
        description: function(){
            if(this.selected!=null){
                const distance=this.routes.routes[this.selected].legs[0].distance.text;
                let quality=parseFloat(this.routes.routes[this.selected].IQARoute);
                
                if(quality<=50) quality="Eccellente"
                else if(50<quality<=70) quality="Buona"
                else if(70<quality<=100) quality="Nella media"
                else if(100<quality<=150) quality="Scarsa"
                else if(150<quality<=200) quality="Cattiva"
                else if(quality>200) quality="Molto cattiva"
                return "Distanza: <strong>"+distance+"</strong>,<br>"+"Qualità dell'aria: <strong>"+quality+"</strong><br>";
            }
            else return null;
        }
    },
    mounted() {
        this.geolocation();
    },
    data() {
        return {
            routes: [],
            markerDestination: null,
            search: null,
            path: this.decode("o_c_G_f_kAHFLFHDLDNBZBP?RABANALEj@ORGVEP?L?P?T@p@Dp@BF?LAX?RA^Ef@IFANARGPEDCDCDEFIBGBKDO?EL@"),
            center: {lat: 41.883664, lng: 12.487312},
            loading: false,
            absolute: false,
            selected: null,
            disabled: true
        }
    },
    methods: {
        startJourney(){
           const waypoints=this.routes.routes[this.selected].legs[0].steps.map((el)=>{
                return el.end_location.lat+","+el.end_location.lng
           });
           const redirect_url=`https://www.google.com/maps/dir/?api=1&origin=${this.center.lat+","+this.center.lng}&destination=${this.markerDestination.lat+","+this.markerDestination.lng}&waypoints=${waypoints.join("|")}`;
           console.log(redirect_url);
           alert("Ricordati di tenere l'applicazione in background!")
           window.open(redirect_url, '_blank');
           
        },
        select(index){
            console.log(index);
            this.selected=index;
        },
        searchRoutes(data){
            this.loading=true;
            const lat=data.geometry.location.lat();
            const lng=data.geometry.location.lng();
            
            const destination=lat+","+lng;
            const origin=this.center.lat+","+this.center.lng;
           fetch(`http://localhost:5000/api/route?origin=${origin}&destination=${destination}`)
           .then(response => response.json())
            .then(data => {
            
            this.routes=data;
            this.selected=parseInt(this.routes.healthier);
            console.log(this.routes.healthier);
            
            this.path=this.decode(data.routes[0].overview_polyline.points);
            this.loading=false;
            this.markerDestination={
                lat: lat,
                lng: lng
            }
            });
            this.disabled=false;
            
        },
        geolocation : function() {
            navigator.geolocation.getCurrentPosition((position) => {
              this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
            });
          },
          optionMake(route){
            //{ strokeColor: color(route), strokeWeight: 10,strokeOpacity: 1 }
          },
          decode : function(str, precision) {
            var index = 0,
                lat = 0,
                lng = 0,
                coordinates = [],
                shift = 0,
                result = 0,
                byte = null,
                latitude_change,
                longitude_change,
                factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);
        
            // Coordinates have variable length when encoded, so just keep
            // track of whether we've hit the end of the string. In each
            // loop iteration, a single coordinate is decoded.
            while (index < str.length) {
        
                // Reset shift, result, and byte
                byte = null;
                shift = 0;
                result = 0;
        
                do {
                    byte = str.charCodeAt(index++) - 63;
                    result |= (byte & 0x1f) << shift;
                    shift += 5;
                } while (byte >= 0x20);
        
                latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        
                shift = result = 0;
        
                do {
                    byte = str.charCodeAt(index++) - 63;
                    result |= (byte & 0x1f) << shift;
                    shift += 5;
                } while (byte >= 0x20);
        
                longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        
                lat += latitude_change;
                lng += longitude_change;
        
                coordinates.push({lat:lat / factor, lng: lng / factor});
            }
        
            return coordinates;
        }
    }

}