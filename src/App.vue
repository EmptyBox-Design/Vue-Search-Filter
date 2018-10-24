<template>
    <div id="app">
        <div class="top ui">
            <h2>{{title}}</h2>
            <div class="dropdown">
                <input v-model="searchValue" placeholder="Search Films" type="text" :change="search" class="search-entry user-enter" @click="showOptions()" />
                <input tableindex="100" type="text" :placeholder="predictiveText" class="search-entry predictive">
                <div class="dropdown-content" v-show="optionsShown === true" role="menu">
                    <a href="#" tabindex="0" class="dropdown-item" :aria-labelledby="item"   @keyup.enter="selectOption(item)" @mousedown="selectOption(item)" v-for="(item, index) in search" :key="index">{{item}}</a>
                </div> 
            </div>
        </div>
        <div class="dashboard ui">
            <div class="container">
                <div class="film-content" v-show="Object.keys(selected).length > 0">
                    <div class="row">
                        <div class="col-12 title film-item ">
                            {{selected.title}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 film-item director">
                            Director: {{selected.director}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 film-item date">
                            Release Date: {{selected.release_date}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 film-item rotton-tomatoes-score">
                            <icon class="far" name="star"></icon>
                            <div class="film-item score">Rotton Tomatoe Score: {{selected.rt_score}}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <p class="film-item description">{{selected.description}}</p>
                        </div>
                    </div>
                </div>
                <!-- <div class="place-holder" v-show="Object.keys(selected).length <= 0">
                    Please Select a Studio Ghibli Movie.
                </div> -->
            </div>
        </div>
        <div class="footer">
            <small>Created by: {{creator}}</small>
            <br>
            <a :href="attributionLink">{{attribution}}</a>
        </div>
    </div>
</template>

<script>
//HTTP promise library
import axios from "axios";

export default {
    name: 'app',
    data: function(){
        return {
            title: "Studio Ghibli Film Search",
            searchValue: "",
            films: [],
            errors: [],
            optionsShown: false,
            filmData: null,
            predictiveReturn: "",
            searchLength: 0,
            selected: {},
            filmInfo: ["id","people", "species", "locations", "vehicles", "url"],
            attribution: "Built using Studio Ghibli Open API",
            attributionLink: "https://ghibliapi.herokuapp.com/",
            creator: "Brandon M. Pachuca"
        }
    },
    created(){
        let self = this;
        // on Vue init fire API call and await until it returns. 
        axios.get("https://ghibliapi.herokuapp.com/films").then(response => {
            if(response.status === 200){
                let keys = this.filmInfo;
                // remove uneeded data from object; this function is optional, since the amount of data is small,
                // I do this to keep the data within the front-end as minimal as possible.
                this.filmData = response.data.map(function(obj){
                    keys.forEach(function(key){
                        delete obj[key];
                    })
                    return obj;
                });
                //return titles to searchalbe array
                this.filmData.forEach(function(obj, index){
                    self.films.push(obj.title);
                });
            }
        })
        .catch(e => {
            this.errors.push(e)
        });
    },
    computed: {
        predictiveText(){
            return this.predictiveReturn;
        },
        search(){
            let self = this;
            // localize search value for function
            let searchTerm = this.searchValue;
            // check to ensure string has at least one character
            if(searchTerm.length > 0){
                // filter existing data
                return this.films.filter(function(term){
                    // change search value and item iterator to uppercase for comparision
                    let match = term.toUpperCase().indexOf(searchTerm.toUpperCase());
                    // run character check
                    if(match  > -1){
                        // see if user input matches at least the first 5 letters of the match. 
                        // if it does prefill search bar
                        let t = term.toUpperCase().substring(0, 5);
                        let s = searchTerm.toUpperCase().substring(0, 5);

                        if(t === s){
                            self.predictiveReturn = term;
                        }else{
                            self.predictiveReturn = "";
                        }
                        // return if any character matches. This also works for character groups
                        return term;
                    }
                });
            }else{
                // if not match return original array or if not input is given on init
                return this.films;
            }
        },
        // return the selected film from the search bar.
        selectedFilm(){
            return this.selected;
        }
    },
    methods: {
        // turn dropdown on/off
        showOptions: function(){
            this.optionsShown = true;
        },
        // On Click from search bar clear out selected array, close dropdown, clear search value to
        // empty string and send input search term to match function.
        selectOption: function(item){
            this.selected = [];
            this.optionsShown = false;
            this.searchValue = "";
            this.predictiveReturn = "";
            this.showFilmData(item);
        },
        // matches film to selected input term from the search bar.
        showFilmData: function(filmName){
            const self = this;
            self.filmData.map(function(obj,index){
                if(obj.title === filmName){
                self.selected = obj;
                }
            });
        }
    },
    mounted(){

    }
}
</script>

<style scoped lang="scss">
$search-width: 15rem;
$search-height: 2rem;
$accent: #DC6A98;
$purple1: #553D4E;
$purple2: #3D343F;
$pink: #FA74A9;
$grey: #65606D;
$black: #333; 

$spacing-sm: 1.5rem;
$spacing-md: 2rem;
$spacing-lg: 3rem;

$font-sm: 0.8rem;
$font-md: 1rem;
$font-lg: 1.3rem;
$font-xlg: 1.5rem;
$font-xxlg: 3rem;

@mixin background-color($color1, $color2) {
   background: color1;  
   background: -webkit-linear-gradient(to right, $color1, $color2);
   background: linear-gradient(to right, $color1, $color2);
}
body{
    margin: 0;
    padding: 0;
    font-family: 'Roboto', "sans-serif";
    font-size: $font-lg;
}
#app{
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    margin: 0;
    align-items: center;
    justify-content: center;
    @include background-color($purple1,$purple2);

    .ui{
        display: flex;
        flex-direction: column;
        max-height: 75vh;
        overflow-y: auto;
        width: 80vw;

        &.dashboard{
            position: absolute;
            top: 12rem;
            justify-content: space-around;
            width: 50vw;
            padding: 15px;

            border-radius: 15px;
            transition: all .3s;
        }
        &.top{
            position: absolute;
            top: $spacing-lg;
            width: 50%;

            h2{
                color: white;
                margin-bottom: $spacing-lg;
                letter-spacing: 2px;
            }
        }
    }
    .footer{
        position: absolute;
        bottom: $spacing-md;
        margin: auto;
        text-align: center;
        font-size: $font-sm;

        a{
            text-decoration: none;
            color: lighten($grey, 40%);

            &:hover{
                color: $accent;
            }
        }
        small{

            color: lighten($grey, 60%);
        }
    }
    .search-entry{
        display:flex;
        height: $search-height;
        width: 100%;
        margin: 0 auto;
        padding: 1rem;
        
        color: white;
        font-size: $font-lg;

        background: transparent;

        &.user-enter{
            border: 1px solid $grey;
            // background-color: $grey;
            outline-color: $accent;
            z-index: 1;
        }
        &.predictive{
            position: absolute;
            top: 0px;
            pointer-events: none;
            user-select: none;
            opacity: 0.4;
            border: none;
            outline: none;
            z-index: 0;
        }

        &:hover, &:active{
            border-color: $accent;
        }
    }
    ::placeholder{
        color: lighten($grey, 40%);
    }
    .dropdown-content{
        position: relative;
        margin: 0 auto 0 auto;
        width: 100%;
        max-height: 5em;
        overflow-y: auto;
        background: $grey;
        
        .dropdown-item{
            padding: 10px;
            margin-left: 7px;
            color: white;
            
            cursor: pointer;
            &:focus{
                // color: #16181b;
                text-decoration: none;
                background:none!important;
                outline: none;
                border-left: 2px solid $accent;
                background: none;
                color: $accent;
            }
            &:active{
                border-left: 2px solid $accent;
                background: none;
                color: $accent;
            }
            &:focus-within{
                border-left: 2px solid $accent;
                background: none;
                color: $accent;
            }
            &:hover{
                border-left: 2px solid $accent;
                background: none;
                color: $accent;
            }
        }
    }
    .film-item, .place-holder{
        padding: 5px;
        font-weight: 300;
        color:white;

        &.title{
            font-weight: 400;
            font-size: $font-xlg;
            letter-spacing: 2px;
        }
        &.description{
            max-height: 10em;
            overflow-y: auto;
        }
        &.date{
            font-size: $font-sm;
        }
        &.director{
            font-size: $font-sm;
        }
        &.rotton-tomatoes-score{
            display: flex;
            align-items: center;

            .far{
                fill: $accent;
            }
        }
    }
}
</style>
