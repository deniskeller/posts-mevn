<template>
  <v-app id="inspire">
    <v-app-bar app color="green" dark>
      <v-app-bar-nav-icon @click.stop="mini = !mini" />
      <v-toolbar-title class="ml-0 pl-4" style="width: 300px">
        <span class="hidden-sm-and-down">MEVN project</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="scroll-y" fluid>
        <v-row align="center" justify="center">
          <v-col cols="8" md="8">
            <v-card class="ml-5 mr-5">
              <v-app-bar dark color="#2c3a47">
                <v-btn icon>
                  <v-icon>local_offer</v-icon>
                </v-btn>
                <v-toolbar-title>Посты</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="800px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="red" v-on="on" outlined="">
                      <v-icon left>add</v-icon>Добавить
                    </v-btn>
                  </template>
                  <v-card>
                    <v-form
                      @submit.prevent="savePost"
                      ref="postData"
                      lazy-validation
                      enctype="multipart/form-data"
                      autocomplete="off"
                    >
                      <v-card-title>
                        <span class="headline">Посты</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                              <v-text-field
                                label="Название"
                                v-model="postData.name"
                                color="#2c3a47"
                              ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                              <v-text-field
                                label="Описание"
                                v-model="postData.description"
                                color="#2c3a47"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="#2c3a47"
                          dark
                          @click="close"
                          outlined
                          small
                        >
                          <v-icon left>exit-to-app</v-icon>Закрыть
                        </v-btn>
                        <v-btn
                          color="light-green darken-4"
                          type="submit"
                          dark
                          outlined
                          small
                        >
                          <v-icon left>save</v-icon>{{saveDialog}}
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
              </v-app-bar>
              <v-container>
                <v-card class="mx-auto elevation-19">
                  <v-card-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      append-icon="search"
                      label="Поиск"
                      single-line
                      hide-details
                      color="#2c3a47"
                    >
                    </v-text-field>
                  </v-card-title>
                  <v-data-table
                    item-key="id"
                    :headers="headers"
                    :items="posts"
                    :search="search"
                  >
                    <template v-slot:item.actions="{item}">
                      <v-btn
                        color="success"
                        class="mx-2"
                        fab
                        x-small
                        @click="editPost(item)"
                        outlined
                      >
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        color="pink"
                        class="mx-2"
                        fab
                        x-small
                        @click="deletePost(item._id)"
                        outlined
                      >
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <template v-slot:no-results>
                      <v-alert :value="true" color="pink" icon="warning" dark>
                        Your Search {{ search }} does not exist...
                      </v-alert>
                    </template>
                  </v-data-table>
                </v-card>
              </v-container>
            </v-card>

            <v-snackbar v-model="snackbar" top right :color="color">
              {{ text }}
              <v-btn color="black" text @click="snackbar = false">Ок </v-btn>
            </v-snackbar>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-btn
      v-scroll="onScroll"
      bottom
      color="red"
      dark
      fab
      fixed
      right
      @click="toTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  components: {},
  props: {
    source: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    mini: false,
    dialog: false,
    fab: false,
    posts: [],
    headers: [
      { text: "Имя", value: "name", sortable: true },
      { text: "Описание", value: "description", sortable: true },
      { text: "Действие", value: "actions", sortable: false, width: "180px" },
    ],
    postData: {
      name: "",
      description: "",
    },
    default: {
      name: "",
      description: "",
    },
    editedIndex: -1,
    search: "",
    text: "",
    snackbar: false,
    color: "",
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  computed: {
    saveDialog() {
      return this.editedIndex === -1 ? 'Сохранить' : 'Изменить'
    }
  },
  mounted() {
    this.loadPosts();
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrolltop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.postData = Object.assign({}, this.default);
        this.editedIndex = -1;
      }, 300);
    },
    loadPosts: async function() {
      let apiURL = "http://localhost:4000/api";
      axios
        .get(apiURL)
        .then((res) => {
          this.posts = res.data;
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    },
    savePost: async function() {
      if (this.editedIndex > -1) {
        this.updatePost();
        console.log("update");
      } else {
        this.createPost();
      }
    },
    createPost() {
      const apiURL = "http://localhost:4000/api/create-post";
      axios
        .post(apiURL, this.postData)
        .then(() => {
          this.postData = {
            name: "",
            description: "",
          };
          this.close();
          this.loadPosts();
          this.color = "success";
          this.text = "Пост был успешно создан";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log("error1: ", error);
        });
    },
    editPost(item) {
      this.editedIndex = this.posts.indexOf(item);
      this.postData = Object.assign({}, item);
      this.dialog = true;
    },
    updatePost() {
      const apiURL = `http://localhost:4000/api/update-post/${this.postData._id}`;
      axios.post(apiURL, this.postData).then((res) => {
        console.log('res: ', res);
        this.close();
        this.loadPosts();
        this.color = 'info';
        this.text = 'Пост был изменен';
        this.snackbar = true;
      }).catch((error) => {
        console.log('error: ', error);
        console.log(this.$route.params.id);
      })
    },
    deletePost(id) {
      console.log('id: ', id);
      this.$swal({
        title: 'Вы уверены?',
        text: 'Изменения не вернуть',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00b894',
        cancelButtonColor: '#d63031',
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',        
      }).then((result) => {
        if(result.value) {
          try {
            const apiURL = `http://localhost:4000/api/delete-post/${id}`;
            const indexOffArrayItem = this.posts.findIndex(i => i._id === id);
            axios.delete(apiURL).then(() => {
              this.posts.splice(indexOffArrayItem, 1);
            }).catch((error) => {
              console.log('error: ', error);
            });
            this.$swal(
              'Удален!',
              'Пост был удалоен!',
              'success'
            )
            this.color = 'error';
            this.text = 'Пост был удален';
            this.snackbar = true;
          } catch (error) {
            this.$swal(
              "Ошбка",
              'пПроизошла ошибка',
              'warning'
              )         
            console.log('error: ', error);
          }
        }
      })
    }
  },
};
</script>
