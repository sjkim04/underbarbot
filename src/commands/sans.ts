import { UpdatedInteraction } from "..";

const { SlashCommandBuilder } = require('discord.js');

const getRandomInt = (max: number) => {
	return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sans')
		.setDescription('welp.'),
	execute(interaction: UpdatedInteraction) {
		const locales = {
			en: 'wanna have a bad time?',
			ko: '끔찍한 시간을 보내고 싶어?',
		};

		let content: string;
		const randNum = getRandomInt(999);

		if (randNum === 1) {
			content = "와 샌즈! 파피루스! 언더테일 아시는구나! 혹시 모르시는 분들을 위해 설명해 드리자면, [중대 스포주의]\n||샌즈란, 2014년 인디 게임 UNDERTALE의 세 가지 엔딩 루트 중 몰살 엔딩의 최종 보스로, 진짜 어려워요. 농담 아님. 플레이어가 하는 공격은 전부 다 회피하고, 최대 HP가 92인데 샌즈의 공격은 1프레임당 1(30데미지/초)이 닳는 것 뿐만 아니라, 독 데미지까지 추가로 붙어 있어요.. 진짜 깨지 말라는 건가 싶기도 하지만, 역시 게임엔 돌파구가 있는 법. 토비 폭스님은 이 무적 같은 캐릭터에 치명적인 약점을 추가합니다. 바로 지친다는 것. 샌즈의 패턴들을 다 견디고 나면, 턴을 넘기면 자신이 죽을 테니, 절대 턴을 넘겨 주지 않는다 하고 존버를 탑니다. 하지만 너무 지쳤는지, 2분 뒤에는 꿈나라로 정신 TP를 타 버리죠. 박스를 옮겨서 공격 버튼을 눌러 시도하지만, 역시 회피. 다만 플레이어가 하지 않았는데도 불구하고 나온 2차 공격은 읽지 못했는지, 직빵을 막고 그대로 사망합니다.||\n(특별 버전)";
		}
		else if (randNum <= 99) {
			content = "와 샌즈! 파피루스! 언더테일 아시는구나! 혹시 모르시는분들에 대해 설명해드립니다 ||샌즈랑 언더테일의 세가지 엔딩루트중 몰살엔딩의 최종보스로 진.짜.겁.나.어.렵.습.니.다 공격은 전부다 회피하고 만피가 92인데 샌즈의 공격은 1초당 60이 다는데다가 독뎀까지 추가로 붙어있습니다.. 하지만 이러면 절대로 게임을 깰 수 가없으니 제작진이 치명적인 약점을 만들었죠. 샌즈의 치명적인 약점이 바로 지친다는것입니다. 패턴들을 다 견디고나면 지쳐서 자신의 턴을 유지한채로 잠에듭니다. 하지만 잠이들었을때 창을옮겨서 공격을 시도하고 샌즈는 1차공격은 피하지만 그 후에 바로날아오는 2차 공격을 맞고 죽습니다.||";
		}

		content = !!content ? content : (locales[interaction.locale] ?? locales['en']);

		interaction.reply(content);
	},
};