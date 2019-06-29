var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
    fetch: function () {
        var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        todos.forEach(function (todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    save: function (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}


new Vue({
    el: '#app',

    data: {
        todos: [],
        current: -1,
        options: [
            { value: -1, label: 'All'},
            { value: 0, label: 'Working' },
            { value: 1, label: 'Complete' }
        ],
    },

    computed: {
        computedTodos: function () {
            return this.todos.filter(function (el) {
                return this.current < 0 ? true : this.current === el.state
            }, this)
        },

        labels() {
            return this.options.reduce(function (a, b) {
                return Object.assign(a, { [b.value]: b.label })
            }, {})
        },
        computedDate() {
            return this.getTomorrowDate()
        }
    },

    // watch: ウォッチャ機能を使うことで
    // データの変化に応じてあらかじめ登録しておいた処理を自動的に行う
    watch: {
        todos: {
            handler: function (todos) {
                todoStorage.save(todos)
            },

            deep: true
        }
    },

    created() {
        this.todos = todoStorage.fetch()
    },

    methods: {
        doAdd: function(event, value) {
            var comment = this.$refs.comment
            var limitDate = this.$refs.limitDate
            var limitTime = this.$refs.limitTime

            if (!comment.value.length) return


            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                limitDate: limitDate.value,
                limitTime: limitTime.value,
                state: 0
            })

            comment.value = ''
            limitDate.value = this.getTomorrowDate()
            limitTime.value = ''
        },

        doChangeState: function (item) {
            item.state = !item.state ? 1 : 0
        },

        doRemove: function (item) {
            var index = this.todos.indexOf(item)
            this.todos.splice(index, 1)
        },

        getTomorrowDate: function() {
            var tomorrow = new Date()
            var year = tomorrow.getFullYear()
            var month = tomorrow.getMonth() + 1
            var day = tomorrow.getDate() + 1

            var toTwoDigits = function (num, digit) {
                num += ''
                if (num.length < digit) {
                    num = '0' + num
                }
                return num
            }

            var yyyy = toTwoDigits(year, 4)
            var mm = toTwoDigits(month, 2)
            var dd = toTwoDigits(day, 2)
            var ymd = yyyy + "-" + mm + "-" + dd
            return ymd
        }
    }
})