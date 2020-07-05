export default {
    template: `
    <div class="user-progress">
        <div v-if="user">
            <div class="welcome-user">
                <h2> Welcome {{user.name}}! </h2>
            </div>
            <div class="user-progress-group">
                <div class="user-progress-item">
                    <v-progress-circular 
                    color= "success"
                    :value= "kmToday"
                    rotate="-90"
                    size="100"
                    width="15"
                    > 
                    {{parseFloat(user.kmToday).toFixed(2)}}
                    </v-progress-circular >
                    <strong>Km di oggi</strong>
                </div>
                <div class="user-progress-item">
                    <v-progress-circular 
                    color= "success"
                    :value= "Co2"
                    rotate="-90"
                    size="100"
                    width="15"
                    > 
                    {{parseFloat(user.kmWeek).toFixed(2)}}
                    </v-progress-circular >
                    <strong>Km questa settimana</strong>
                </div>
            </div>
            <div class="user-progress-group">
                <div class="user-progress-item">
                    <v-progress-circular 
                    color= "success"
                    :value= "kmMonth"
                    rotate="-90"
                    size="100"
                    width="15"
                    > {{parseFloat(user.kmMonth).toFixed(2)}}
                    </v-progress-circular>
                    <strong>Km di questo mese</strong>
                </div>
                <div class="user-progress-item">
                    <v-progress-circular 
                    color= "success"
                    :value= "kmTotal"
                    rotate="-90"
                    size="100"
                    width="15"
                    > {{parseFloat(user.kmDone).toFixed(2)}}
                    </v-progress-circular>
                    <strong>Km totali</strong>
                </div>
                
            </div>
            
            <div class="user-progress-group">
                <div class="user-progress-item">
                    <img src="https://www.armo1191.it/wp-content/uploads/2016/02/foglia-green.png" width="100">
                    <span> - {{Co2}} grammi </span>
                    <strong>CO2 risparmiata</strong>
                </div>
                <div class="user-progress-item" v-if="user.role==='premium'">
                    <router-link to="/ecocredits">
                        <img src="https://lh3.googleusercontent.com/fhGTKBpjyZlD4haIW8T1yBwEQMU4AC0zK9W6DVSFT5E7aU2DFoyRXKP3wH_yhuQD63Q" width="100">
                    </router-link>
                    <span> {{user.ecocredits}} ecoC </span>
                    <strong>I tuoi eco crediti</strong>
                </div>
            </div>
            <div class="user-progress-group">
                <div class="user-progress-item">
                    <router-link to="/newJourney">
                        <img src="https://cdn.onlinewebfonts.com/svg/img_465794.png" width="100">
                    </router-link>
                    <strong>Cerca percorso</strong>
                </div>
                
            </div>
            
        </div>
    </div>
    `,
    data() {
        return {
            user:null
        }
    },
    created() {
            fetch("http://localhost:5000/api/users")
            .then(response => response.json())
            .then(data => {
            this.user=data;
            });
    },
    computed: {
        kmTotal: function(){
            return (this.user.kmDone/14880)*100
        },
        kmMonth: function(){
            return (this.user.kmDone/1240)*100
        },
        kmWeek: function(){
            return (this.user.kmWeek/280)*100
        },
        kmToday: function(){
            return (this.user.kmToday/40)*100
        },
        Co2: function(){
            return (94,4*parseFloat(this.user.kmDone)).toFixed(2)
        }
    },


}
