<template>
  <b-form-group :label="label" :label-for="name" class="dropdown">
    <b-form-input
      class="dropdown-input"
      :id="name"
      v-model="searchFilter"
      type="text"
      aria-describedby="review-item-feedback"
      :state="validateState('searchFilter')"
      @input="onInputChange()"
      @focus="showOptions()"
      @blur="hideOptions()"
      :name="name"
      :disabled="disabled"
      :placeholder="placeholder"
      autocomplete="off"
    />

    <div class="dropdown-content" v-show="optionsShown">
      <div
        class="dropdown-item"
        @mousedown="selectOption(option)"
        v-for="(option, index) in optionsList"
        :key="index">
        <div class="img-wrapper">
          <img v-if="option.cover" :src="option.cover">
          <img v-if="!option.cover" src="/temp-cover.jpg">
        </div>
        <span>{{ option.title }}</span>
      </div>
    </div>

    <b-form-invalid-feedback id="review-item-feedback">
      Required
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
  import { debounce } from 'debounce';
  import { validationMixin } from 'vuelidate';
  import { required } from 'vuelidate/lib/validators';

  export default {
    name: 'ReviewerDropdown',
    template: 'ReviewerDropdown',
    mixins: [validationMixin],
    props: {
      name: {
        type: String,
        required: false,
        default: 'dropdown',
        note: 'Input name'
      },
      label: {
        type: String,
        required: false,
        default: 'Reviewer',
        note: 'Input label'
      },
      placeholder: {
        type: String,
        required: false,
        default: 'Select a reviewer',
        note: 'Placeholder of dropdown'
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
        note: 'Disable the dropdown'
      },
      maxItem: {
        type: Number,
        required: false,
        default: 20,
        note: 'Max items showing'
      },
      valueName: {
        type: String,
        required: false,
        default: '',
        note: 'Item name'
      },
      valueImage: {
        type: String,
        required: false,
        default: '',
        note: 'Item image'
      }
    },
    data() {
        return {
          optionsList: [],
          optionsShown: false,
          selected: {
            title: this.valueName,
            image: this.valueImage
          },
          searchFilter: this.valueName
        }
    },
    created() {
      this.$emit('selected', this.selected);
    },
    validations: {
      searchFilter: {
        required,
        isValid(value) {
          if (value == '' || !this.selected.title) {
            return false;
          } else {
            return true;
          }
        },
      },
    },
    methods: {
      validateState(name) {
        const { $dirty, $error } = this.$v[name];
        return $dirty ? !$error : null;
      },
      selectOption(option) {
        this.selected = {
          title: option.title,
          image: option.cover,
        }
      },
      showOptions() {
        this.optionsShown = true;
      },
      hideOptions() {
        if (!this.selected.title) {
          this.selected = {};
          this.searchFilter = "";
        } else {
          this.searchFilter = this.selected.title;
        }

        this.optionsShown = false;
        this.$emit('selected', this.selected);
      },
      onInputChange: debounce(function(event) {
        this.optionsList = [];
        this.selected = {};
        this.onSearch();
      }, 300),
      onSearch() {
        if (this.searchFilter.length == 0 || this.searchFilter.length > 2) {
          this.$store
            .dispatch('searchGamesTitles', {
              keyword: this.searchFilter.trim()
            })
            .then((result) => {
              if (result) {
                this.optionsList = result.gamesTitles;
              }
            })
        }
      },
    },
    computed: {
    },
    watch: {
    }
  }
</script>

<style lang="scss" scoped>
.dropdown-content {
    position: absolute;
    background-color: #fff;
    width: 100%;
    min-width: 248px;
    max-width: 100%;
    max-height: 248px;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    /*box-shadow: 0px -8px 34px 0px rgba(0,0,0,0.05);*/
    box-shadow: 0 0 0 0.2rem rgba(0,0,0,0.05);
    overflow: auto;
    z-index: 1;
    .dropdown-item {
      color: black;
      font-size: .9em;
      line-height: 1em;
      padding: 8px;
      text-decoration: none;
      display: flex;
      cursor: pointer;
      overflow: hidden;
      align-items: center;

      &:hover {
        background-color: #e7ecf5;
      }

      .img-wrapper {
        display: inline-block;
        width: 70px;
        height: 50px;
        margin-right: 5px;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      span {
        white-space: break-spaces;
        flex-shrink: 30;
      }

    }
  }
</style>