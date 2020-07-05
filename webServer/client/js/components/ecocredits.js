export default {
    template: `
        <div v-if="user">
            <h1 style="margin:auto; width:fit-content"> I tuoi ecocrediti </h1>
            <v-card :shaped="shaped"> 
            <v-card-title ><div style="margin:auto; width:fit-content; color: green"><h1>{{user.ecocredits}}<span style="font-size:25px">ecoC</span></h1></div> </v-card-title>
            </v-card>
            <h3 style="margin:auto;margin-top:20px; width:fit-content"> Scopri cosa puoi acquistare: </h3>
            <div>
                <v-container fluid>
                <v-row dense>
                <v-col v-for="item in fakeCatalog" :cols="item.flex">
                <v-card outlined   class="mx-auto">
                        <v-img
                        class="black--text align-end"
                        height="100px"
                        :src="item.img"
                        >
                    </v-img>
                    <v-card-title>{{item.title}}</v-card-title>
                    <v-card-subtitle>
                        {{item.price}}ecoC
                    </v-card-subtitle>
                    <v-card-text class="text--primary">
                        <div>{{item.description}}</div>
                    </v-card-text>
                </v-card>
                </v-col>
                </v-row>
            <div>
        </div>
    `,
    data() {
        return {
            user:null,
            shaped: true,
            fakeCatalog:[
                {
                    title: "Biglietti autobus ATAC",
                    price: 10,
                    img: "https://www.trasporti-italia.com//upload/images/citta/thumbs/atac_logo_tn_290_230.png",
                    description: "Aquistali dal tuo telefono, ti verrà inviato un QRCode che sarà valido come biglietto",
                    flex: 12
                },
                {
                    title: "Borraccia ecologica",
                    price: 120,
                    img: "https://www.green.it/wp-content/uploads/2018/03/3.cristinabrotons.jpg",
                    description: "Stop alla plastica, spendi i tuoi ecocrediti per un’alternativa sostenibile alle bottiglie di plastica.",
                    flex: 12
                },
            ]
        }
    },
    created() {
            fetch("http://localhost:5000/api/users")
            .then(response => response.json())
            .then(data => {
            this.user=data;
            });
    },
}