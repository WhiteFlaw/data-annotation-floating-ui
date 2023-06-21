const getDefaultState = () => {
  return {
    searchCondition: {}, // teamLeader页面查询条件
    teamNameId: '',
    activeName: 'teamListData',
    page: 1, // 页数
    limit: 20 // 条数
  }
}

const state = getDefaultState()

const mutations = {
  RESET_SEARCH_CONDITION: (state, searchCondition) => {
    state.searchCondition = {...searchCondition}
  },
  RESET_ACTIVE_NAME: (state, activeName) => {
    state.activeName = activeName
  },
  RESET_TEAM_NAME_ID: (state, teamNameId) => {
    state.teamNameId = teamNameId
  },
  RESET_PAGE: (state, page) => {
    state.page = page
  },
  RESET_LIMIT: (state, limit) => {
    state.page = limit
  },
  resetState(state) {
    // 将 state 对象重置为 getDefaultState 返回的默认状态对象
    Object.assign(state, getDefaultState())
  }
}
const getters = {
  getSearchCondition: state => {
    return state.searchCondition
  },
  getTeamNameId: state => {
    return state.teamNameId
  },
  getActiveName: state => {
    return state.activeName
  },
  getPage: state => {
    return state.page
  },
  getLimit: state => {
    return state.limit
  }
}
const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
