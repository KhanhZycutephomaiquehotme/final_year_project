const state = {
    data:{
        football_fields: football_fields,
        referees: referees,
        teams: data,
    },
    tournament : {
        name: "Giải bóng đá sinh viên 2026",
        rounds: [],
    },
    elements: {
        // Lưới xếp trận đấu theo từng vòng
        bracket       : document.getElementById('bracket'),
        bracketContent: document.getElementById('bracket-content'),
        bracketLine   : document.getElementById('bracket-line'),
        // Danh sách tất cả đội bóng
        listTeam      : document.getElementById('list-team'),
        // Modal thiết lập trận đấu
        detailMatchModal   : {
            modal: document.getElementById('settingMatch'),
            // Thiết lập cầu thủ ra sân
            footballOverlay: document.getElementById('football-overlay'),
            playerList     : document.getElementById('player-list'),

            // Thiết lập thông tin trận đấu
            inputScoreTeam1        : document.getElementById('scoreTeam1'),
            inputScoreTeam2        : document.getElementById('scoreTeam2'),
            radioSettingMatchScores: document.querySelectorAll('input[name="radioSettingMatchScore"]'),
            radioSettingMatchScore1: document.getElementById('radioSettingMatchScore1'),
            radioSettingMatchScore2: document.getElementById('radioSettingMatchScore2'),
            selectFootballField    : document.getElementById('selectFootballField'),
            selectReferee          : document.getElementById('selectReferee'),
            matchTime              : document.getElementById('matchTime'),
            // Thiết lập diễn biến trận đấu
            // Màn che
            matchFlowLock         : document.getElementById('match-flow-lock'),
            matchFlowContainerDemo: document.getElementById('match-flow-container-demo'),
            matchFlowContainer    : document.getElementById('match-flow-container'),
            matchFlowDemo         : document.getElementById('match-flow-demo'),
            matchFlow             : document.getElementById('match-flow-list'),
            btnEnableMatchFlow    : document.getElementById('btn-enable-match-flow'),
            // Thiết lập diễn biến trận đấu
            matchFlowList: document.getElementById('match-flow-list'),

        }
    }
}
// Tính bằng phút
const time_max = {
    "round_1"        : 45,
    "min_round_1"    : 0,
    "round_2"        : 90,
    "min_round_2"    : 45,
    "every_round_sub": 15,
}

async function init () {
    await loadDataComponents();
    renderBracketNew(state.data.teams.length, true);
    renderListTeam();
    renderSortable();
    window.addEventListener("resize", renderLineBracket);
    // render tạm match flows
    await temp_renderMatchFlow();
    // Chuẩn bị sẵn data cho edit match
    await prepareDataEdit();
    // $('#settingMatch').modal('show');
    state.elements.detailMatchModal.radioSettingMatchScore2.checked = true;
    state.elements.detailMatchModal.radioSettingMatchScore2.dispatchEvent(
            new Event('change', { bubbles: true })
    );
    // $('#fill-tabpanel-2').tab('show');
    $('#eventFormPanel').offcanvas('show');
} 
async function prepareDataEdit() {
    const footballFieldSelect = state.elements.detailMatchModal.selectFootballField;
    state.data.football_fields.forEach((field) => {
        const option = document.createElement('option');
        option.value = field.id;
        option.textContent = field.name;
        footballFieldSelect.appendChild(option);
    });
    // Render select2 (do select2 là jquery plugin nên phải render sau khi DOM đã load xong)
    $('#selectFootballField').select2({
        allowClear: true,
        width: '100%',
        dropdownParent: $('#settingMatch')
    });
    const selectReferee = state.elements.detailMatchModal.selectReferee;
    state.data.referees.forEach((ref) => {
        const option = document.createElement('option');
        option.value = ref.id;
        option.textContent = ref.name;
        selectReferee.appendChild(option);
    });
    // Render select2 (do select2 là jquery plugin nên phải render sau khi DOM đã load xong)
    $('#selectReferee').select2({
        allowClear: true,
        width: '100%',
        dropdownParent: $('#settingMatch')
    });
}
async function temp_renderMatchFlow() {
    const goal_template = document.getElementById('goal-template');
    const red_card_template = document.getElementById('red-card-template');
    const yellow_card_template = document.getElementById('yellow-card-template');
    const substitute_template = document.getElementById('substitute-template');

    const goal_html = goal_template.content.cloneNode(true);
    const red_card_html = red_card_template.content.cloneNode(true);
    const yellow_card_html = yellow_card_template.content.cloneNode(true);
    const substitute_html = substitute_template.content.cloneNode(true);

    const match_flow_container = state.elements.detailMatchModal.matchFlowDemo;
    match_flow_container.appendChild(goal_html);
    match_flow_container.appendChild(red_card_html);
    match_flow_container.appendChild(yellow_card_html);
    match_flow_container.appendChild(substitute_html);

}

async function loadDataComponents() {
    const response = await fetch('./components/match-flows/all.html');

    if (!response.ok) {
        throw new Error('Không load được templates.html');
    }

    const html = await response.text();

    const container = document.createElement('div');
    container.innerHTML = html;

    document.body.appendChild(container);
}


init();