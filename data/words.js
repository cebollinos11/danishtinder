// Danish vocabulary data.
// Format: one entry per line, fields separated by "|":
//   da|en|uk
// da = Danish (the language being learned, fixed)
// en = English translation (home language: en)
// uk = Ukrainian translation (home language: uk)
// Adding a new home language: add a new column to every line, then add
// its code to js/i18n.js (HOME_LANGUAGES) with matching UI strings.
export const WORDS_RAW = `
jeg|I|я
du|you|ти
han|he|він
hun|she|вона
det|it / that|це
vi|we|ми
de|they|вони
og|and|і
er|is / are|є
var|was / were|був
har|have / has|має
havde|had|мав
ikke|not|не
en|a / an (common)|артикль спільного роду
et|a / an (neuter)|артикль середнього роду
i|in|в
på|on|на
til|to|до
med|with|з
for|for|для
af|of / by|від
om|about|про
fra|from|з
der|there|там
som|which / as|який
men|but|але
eller|or|або
hvis|if|якщо
når|when|коли
fordi|because|тому що
så|so / then|тоді
hvad|what|що
hvem|who|хто
hvor|where|де
hvorfor|why|чому
hvordan|how|як
hvilken|which|який
denne|this|цей
disse|these|ці
alle|everyone / all|всі
nogen|someone / any|хтось
noget|something|щось
ingen|nobody|ніхто
mange|many|багато
meget|much / very|дуже
lidt|a little|трохи
mere|more|більше
mest|most|найбільше
altid|always|завжди
aldrig|never|ніколи
tit|often|часто
sommetider|sometimes|іноді
nu|now|зараз
her|here|тут
igen|again|знову
også|also|також
kun|only|тільки
bare|just|просто
måske|maybe|можливо
selvfølgelig|of course|звичайно
ja|yes|так
nej|no|ні
tak|thank you|дякую
hej|hi|привіт
farvel|goodbye|бувай
undskyld|sorry / excuse me|вибач
værsgo|here you go|прошу
at være|to be|бути
at have|to have|мати
at gøre|to do|робити
at sige|to say|казати
at gå|to walk / to go|йти
at komme|to come|приходити
at se|to see|бачити
at vide|to know (a fact)|знати
at kende|to know (a person)|бути знайомим
at tage|to take|брати
at give|to give|давати
at få|to get / to receive|отримувати
at ville|to want|хотіти
at kunne|to be able to|могти
at skulle|shall / must|мусити
at måtte|may / must|можна
at tro|to believe|вірити
at tænke|to think|думати
at synes|to find / to reckon|здаватися
at spørge|to ask|питати
at svare|to answer|відповідати
at tale|to speak|говорити
at snakke|to chat|балакати
at høre|to hear|чути
at lytte|to listen|слухати
at læse|to read|читати
at skrive|to write|писати
at spise|to eat|їсти
at drikke|to drink|пити
at sove|to sleep|спати
at arbejde|to work|працювати
at lege|to play (around)|гратися
at spille|to play (a game)|грати
at købe|to buy|купувати
at sælge|to sell|продавати
at betale|to pay|платити
at bo|to live (reside)|мешкати
at leve|to live (be alive)|жити
at elske|to love|кохати
at kunne lide|to like|подобатися
at hjælpe|to help|допомагати
at bruge|to use|використовувати
at finde|to find|знаходити
at lede|to search|шукати
at begynde|to begin|починати
at slutte|to end|закінчувати
at åbne|to open|відкривати
at lukke|to close|закривати
at vente|to wait|чекати
at møde|to meet|зустрічати
at rejse|to travel|подорожувати
at køre|to drive|їхати
at løbe|to run|бігти
at stå|to stand|стояти
at sidde|to sit|сидіти
at ligge|to lie down|лежати
at glemme|to forget|забувати
at huske|to remember|пам'ятати
at lære|to learn|вчитися
at forstå|to understand|розуміти
at prøve|to try|пробувати
at behøve|to need|потребувати
at lave|to make|робити
en mand|a man|чоловік
en kvinde|a woman|жінка
et barn|a child|дитина
en dreng|a boy|хлопчик
en pige|a girl|дівчинка
en ven|a friend|друг
en familie|a family|сім'я
en mor|a mother|мати
en far|a father|батько
en søster|a sister|сестра
en bror|a brother|брат
et hus|a house|будинок
et hjem|a home|дім
en by|a city / town|місто
et land|a country|країна
en dag|a day|день
en nat|a night|ніч
en morgen|a morning|ранок
en aften|an evening|вечір
en uge|a week|тиждень
en måned|a month|місяць
et år|a year|рік
en time|an hour|година
et minut|a minute|хвилина
tid|time|час
et sted|a place|місце
en ting|a thing|річ
et arbejde|work / a job|робота
en skole|a school|школа
en bog|a book|книга
et ord|a word|слово
et sprog|a language|мова
et navn|a name|ім'я
et menneske|a human being|людина
en verden|a world|світ
et liv|a life|життя
en hånd|a hand|рука
et hoved|a head|голова
et øje|an eye|око
et hjerte|a heart|серце
mad|food|їжа
vand|water|вода
kaffe|coffee|кава
et brød|a loaf of bread|буханка хліба
en bil|a car|машина
en cykel|a bicycle|велосипед
et tog|a train|потяг
en vej|a road|дорога
en gade|a street|вулиця
et værelse|a room|кімната
en dør|a door|двері
et vindue|a window|вікно
et bord|a table|стіл
en stol|a chair|стілець
penge|money|гроші
en butik|a shop|магазин
vejret|the weather|погода
solen|the sun|сонце
regn|rain|дощ
sne|snow|сніг
en hund|a dog|собака
en kat|a cat|кіт
god|good|добрий
dårlig|bad|поганий
stor|big|великий
lille|small|маленький
ny|new|новий
gammel|old|старий
ung|young|молодий
lang|long|довгий
kort|short|короткий
høj|tall / high|високий
lav|low|низький
varm|warm|теплий
kold|cold|холодний
glad|happy|щасливий
ked af det|sad|сумний
træt|tired|втомлений
sulten|hungry|голодний
tørstig|thirsty|спраглий
let|easy|легкий
svær|difficult|складний
hurtig|fast|швидкий
langsom|slow|повільний
rigtig|correct|правильний
forkert|wrong|неправильний
smuk|beautiful|красивий
dyr|expensive|дорогий
billig|cheap|дешевий
første|first|перший
sidste|last|останній
næste|next|наступний
samme|same|той самий
én|one|один
to|two|два
tre|three|три
fire|four|чотири
fem|five|п'ять
seks|six|шість
syv|seven|сім
otte|eight|вісім
ni|nine|дев'ять
ti|ten|десять
hundrede|hundred|сто
tusind|thousand|тисяча
mandag|Monday|понеділок
tirsdag|Tuesday|вівторок
onsdag|Wednesday|середа
torsdag|Thursday|четвер
fredag|Friday|п'ятниця
lørdag|Saturday|субота
søndag|Sunday|неділя
i dag|today|сьогодні
i morgen|tomorrow|завтра
i går|yesterday|вчора
mig|me|мене
dig|you (object)|тебе
ham|him|його
hende|her (object)|її
os|us|нас
jer|you (plural, object)|вас
dem|them|їх
sig|himself / herself|себе
min|my (common)|мій
mit|my (neuter)|моє
din|your (common)|твій
dit|your (neuter)|твоє
hans|his|його
hendes|her (possessive)|її
vores|our|наш
jeres|your (plural)|ваш
deres|their|їхній
sin|his / her own|свій
selv|self / even|сам
hinanden|each other|одне одного
man|one / you (impersonal)|людина
enhver|each / anyone|будь-хто
begge|both|обидва
hver|every|кожен
andre|others|інші
sådan|like that / such|такий
hverken|neither|ні
både|both (… and)|обидва
samt|as well as|а також
dog|however|проте
alligevel|anyway / still|все одно
derfor|therefore|тому
altså|so / in other words|отже
jo|you know (particle)|же
vel|surely / right?|напевно
nok|probably / enough|мабуть
faktisk|actually|насправді
egentlig|really / actually|власне
netop|precisely|саме
præcis|exactly|точно
omkring|around|навколо
mellem|between|між
under|under / during|під
over|over / above|над
bag|behind|за
foran|in front of|перед
ved siden af|next to|поруч з
inde|inside|всередині
ude|outside|зовні
oppe|up there|нагорі
nede|down there|внизу
ind|in (motion)|всередину
ud|out (motion)|назовні
op|up|вгору
ned|down|вниз
hjem|home (motion)|додому
hjemme|at home|вдома
væk|away|геть
tilbage|back|назад
frem|forward|вперед
rundt|around|навкруги
gennem|through|через
langs|along|вздовж
mod|towards / against|проти
uden|without|без
inden|before (time)|до
efter|after|після
før|before|перед
siden|since / ago|тому
mens|while|поки
indtil|until|аж до
straks|immediately|негайно
snart|soon|скоро
længe|for a long time|довго
endnu|yet / still|ще
stadig|still|досі
allerede|already|вже
lige|just / straight|щойно
lige nu|right now|прямо зараз
i aften|tonight|сьогодні ввечері
først|first (adverb)|спочатку
til sidst|finally|врешті-решт
endelig|at last|нарешті
pludselig|suddenly|раптом
langsomt|slowly|повільно
hurtigt|quickly|швидко
sammen|together|разом
alene|alone|наодинці
især|especially|особливо
sjældent|rarely|рідко
næsten|almost|майже
helt|completely|повністю
ret|quite / rather|досить
temmelig|fairly|доволі
alt for|far too|занадто
ligesom|like / as if|наче
i stedet for|instead of|замість
på grund af|because of|через
i forhold til|compared to|порівняно з
for eksempel|for example|наприклад
blandt andet|among other things|серед іншого
i hvert fald|in any case|у будь-якому разі
selvom|even though|хоча
hvorimod|whereas|тоді як
enten|either|чи
uanset|regardless of|незалежно від
ifølge|according to|згідно з
desuden|besides / moreover|крім того
derefter|after that|потім
sandsynligvis|probably|ймовірно
heldigvis|fortunately|на щастя
desværre|unfortunately|на жаль
forhåbentlig|hopefully|сподіваюся
naturligvis|naturally|звісно
absolut|absolutely|абсолютно
overhovedet|at all|взагалі
slet ikke|not at all|зовсім ні
næppe|hardly|навряд чи
i øvrigt|by the way|до речі
i alt|in total|загалом
cirka|approximately|приблизно
mindst|at least|принаймні
højst|at most|щонайбільше
at blive|to become / to stay|ставати
at sætte|to put / to set|ставити
at lægge|to lay down|класти
at stille|to place|ставити
at holde|to hold|тримати
at følge|to follow|слідувати
at føre|to lead|вести
at bringe|to bring|приносити
at hente|to fetch|забирати
at sende|to send|надсилати
at modtage|to receive|одержувати
at bære|to carry|нести
at trække|to pull|тягнути
at skubbe|to push|штовхати
at kaste|to throw|кидати
at fange|to catch|ловити
at samle|to gather|збирати
at dele|to share / to divide|ділити
at bytte|to swap|міняти
at vælge|to choose|обирати
at beslutte|to decide|вирішувати
at planlægge|to plan|планувати
at ordne|to sort out|залагоджувати
at klare|to manage|справлятися
at lykkes|to succeed|вдаватися
at mislykkes|to fail|провалюватися
at forsøge|to attempt|намагатися
at nå|to reach|досягати
at ankomme|to arrive|прибувати
at forlade|to leave (a place)|залишати
at vende|to turn|повертати
at dreje|to turn / to twist|крутити
at flytte|to move something|переставляти
at bevæge sig|to move oneself|рухатися
at rykke|to shift|зрушувати
at stoppe|to stop|зупиняти
at fortsætte|to continue|продовжувати
at gentage|to repeat|повторювати
at ændre|to change|змінювати
at forbedre|to improve|покращувати
at ødelægge|to ruin|псувати
at reparere|to repair|ремонтувати
at bygge|to build|будувати
at skabe|to create|створювати
at danne|to form|формувати
at udvikle|to develop|розвивати
at vokse|to grow|рости
at falde|to fall|падати
at stige|to rise|підніматися
at hoppe|to jump|стрибати
at klatre|to climb|лазити
at svømme|to swim|плавати
at flyve|to fly|літати
at sejle|to sail|плисти
at cykle|to cycle|їздити на велосипеді
at danse|to dance|танцювати
at synge|to sing|співати
at grine|to laugh|сміятися
at græde|to cry|плакати
at smile|to smile|усміхатися
at råbe|to shout|кричати
at hviske|to whisper|шепотіти
at nævne|to mention|згадувати
at fortælle|to tell|розповідати
at forklare|to explain|пояснювати
at beskrive|to describe|описувати
at oversætte|to translate|перекладати
at stave|to spell|писати по буквах
at udtale|to pronounce|вимовляти
at gætte|to guess|вгадувати
at regne|to calculate / to rain|обчислювати
at tælle|to count|рахувати
at måle|to measure|вимірювати
at veje|to weigh|важити
at koste|to cost|коштувати
at tjene|to earn|заробляти
at spare|to save money|заощаджувати
at låne|to borrow / to lend|позичати
at eje|to own|володіти
at tilhøre|to belong to|належати
at mangle|to lack|бракувати
at savne|to miss someone|сумувати
at ønske|to wish|бажати
at håbe|to hope|сподіватися
at frygte|to fear|боятися
at turde|to dare|наважуватися
at nyde|to enjoy|насолоджуватися
at hade|to hate|ненавидіти
at foretrække|to prefer|віддавати перевагу
at mene|to be of the opinion|вважати
at betyde|to mean / to signify|означати
at overveje|to consider|обмірковувати
at opdage|to discover|виявляти
at bemærke|to notice|помічати
at kigge|to look|дивитися
at vise|to show|показувати
at pege|to point|вказувати
at gemme|to hide / to save|ховати
at søge|to search / to apply|шукати
at lave mad|to cook|готувати
at bage|to bake|пекти
at koge|to boil|варити
at stege|to fry|смажити
at smage|to taste|куштувати
at lugte|to smell|пахнути
at røre|to touch / to stir|торкатися
at føle|to feel|відчувати
at mærke|to sense|відчувати
at gøre ondt|to hurt|боліти
at hvile|to rest|відпочивати
at vågne|to wake up|прокидатися
at stå op|to get up|вставати
at gå i seng|to go to bed|лягати спати
at klæde sig på|to get dressed|одягатися
at vaske|to wash|мити
at rense|to clean|чистити
at rydde op|to tidy up|прибирати
at besøge|to visit|відвідувати
at invitere|to invite|запрошувати
at ringe|to phone|телефонувати
at underskrive|to sign|підписувати
at aftale|to arrange|домовлятися
at mødes|to meet up|зустрічатися
at deltage|to take part|брати участь
at arrangere|to organise|організовувати
at starte|to start|починати
at afslutte|to finish|завершувати
at udføre|to carry out|виконувати
at løse|to solve|розв'язувати
at undersøge|to investigate|досліджувати
at forske|to do research|займатися дослідженнями
at studere|to study|навчатися
at undervise|to teach|навчати
at træne|to train|тренуватися
at øve|to practise|вправлятися
at forberede|to prepare|готувати
at kontrollere|to check / to control|контролювати
at tjekke|to check|перевіряти
at rette|to correct|виправляти
at godkende|to approve|схвалювати
at afvise|to reject|відхиляти
at tillade|to allow|дозволяти
at forbyde|to forbid|забороняти
at love|to promise|обіцяти
at true|to threaten|погрожувати
at advare|to warn|попереджати
at beskytte|to protect|захищати
at redde|to rescue|рятувати
at passe|to fit / to look after|доглядати
at pleje|to care for / to usually do|піклуватися
at opdrage|to raise a child|виховувати
at føde|to give birth|народжувати
at gifte sig|to get married|одружуватися
at skilles|to get divorced|розлучатися
at stole på|to trust|довіряти
at lyve|to tell a lie|брехати
at snyde|to cheat|обманювати
at stjæle|to steal|красти
at slå|to hit|бити
at slås|to fight|битися
at skændes|to argue|сваритися
at klage|to complain|скаржитися
at undskylde|to apologise|вибачатися
at tilgive|to forgive|пробачати
at takke|to thank|дякувати
at fejre|to celebrate|святкувати
at vinde|to win|вигравати
at tabe|to lose|програвати
at konkurrere|to compete|змагатися
at risikere|to risk|ризикувати
at tøve|to hesitate|вагатися
at skynde sig|to hurry|поспішати
at glæde sig|to look forward|з нетерпінням чекати
at kede sig|to be bored|нудьгувати
at bekymre sig|to worry|хвилюватися
at slappe af|to relax|розслаблятися
at drømme|to dream|мріяти
at forestille sig|to imagine|уявляти
at ligne|to resemble|нагадувати
at sammenligne|to compare|порівнювати
at adskille|to separate|відокремлювати
at blande|to mix|змішувати
at fylde|to fill|наповнювати
at tømme|to empty|спорожняти
at låse|to lock|замикати
at tænde|to switch on|вмикати
at slukke|to switch off|вимикати
at trykke|to press|натискати
at klikke|to click|клацати
at slette|to delete|видаляти
at printe|to print|друкувати
at downloade|to download|завантажувати
at hedde|to be called|зватися
at bestå|to pass an exam|складати
at dumpe|to fail an exam|провалювати
at ansøge|to apply for|подавати заявку
at ansætte|to hire|наймати
at fyre|to fire someone|звільняти
at levere|to deliver|доставляти
at bestille|to order|замовляти
at reservere|to reserve|бронювати
at afbestille|to cancel|скасовувати
at pakke|to pack|пакувати
at afrejse|to depart|від'їжджати
at lande|to land|приземлятися
at parkere|to park|паркувати
en person|a person|особа
en fyr|a guy|хлопець
en dame|a lady|дама
en kæreste|a boyfriend / girlfriend|партнер
en kone|a wife|дружина
en ægtemand|a husband|чоловік
et par|a couple / a pair|пара
en baby|a baby|немовля
en teenager|a teenager|підліток
en voksen|an adult|дорослий
en bedstemor|a grandmother|бабуся
en bedstefar|a grandfather|дідусь
en tante|an aunt|тітка
en onkel|an uncle|дядько
en fætter|a male cousin|двоюрідний брат
en kusine|a female cousin|двоюрідна сестра
en nevø|a nephew|племінник
en niece|a niece|племінниця
en søn|a son|син
en datter|a daughter|дочка
en nabo|a neighbour|сусід
en kollega|a colleague|колега
en chef|a boss|начальник
en gæst|a guest|гість
en fremmed|a stranger|незнайомець
en kunde|a customer|клієнт
en elev|a pupil|учень
en studerende|a student|студент
en lærer|a teacher|вчитель
en læge|a doctor|лікар
en sygeplejerske|a nurse|медсестра
en tandlæge|a dentist|стоматолог
en politibetjent|a police officer|поліцейський
en brandmand|a firefighter|пожежник
en kok|a chef|кухар
en tjener|a waiter|офіціант
en chauffør|a driver|водій
en pilot|a pilot|пілот
en landmand|a farmer|фермер
en kunstner|an artist|художник
en musiker|a musician|музикант
en forfatter|an author|письменник
en journalist|a journalist|журналіст
en advokat|a lawyer|адвокат
en ingeniør|an engineer|інженер
en politiker|a politician|політик
en konge|a king|король
en dronning|a queen|королева
en krop|a body|тіло
et ansigt|a face|обличчя
et hår|hair|волосся
en næse|a nose|ніс
en mund|a mouth|рот
et øre|an ear|вухо
en tand|a tooth|зуб
en tunge|a tongue|язик
en hals|a neck / throat|шия
en skulder|a shoulder|плече
en arm|an arm|рука
en finger|a finger|палець
et ben|a leg / a bone|нога
en fod|a foot|ступня
en tå|a toe|палець ноги
en ryg|a back|спина
en mave|a stomach|живіт
et bryst|a chest|груди
en hud|skin|шкіра
blod|blood|кров
en knogle|a bone|кістка
en muskel|a muscle|м'яз
en hjerne|a brain|мозок
en sygdom|an illness|хвороба
en smerte|a pain|біль
feber|a fever|гарячка
en forkølelse|a cold (illness)|застуда
en hovedpine|a headache|головний біль
medicin|medicine|ліки
et hospital|a hospital|лікарня
en ulykke|an accident|нещасний випадок
en skade|an injury|травма
sundhed|health|здоров'я
en lejlighed|a flat|квартира
en have|a garden|сад
en altan|a balcony|балкон
et køkken|a kitchen|кухня
et badeværelse|a bathroom|ванна кімната
en stue|a living room|вітальня
et soveværelse|a bedroom|спальня
en kælder|a basement|підвал
et loft|an attic / a ceiling|горище
en trappe|a staircase|сходи
en væg|a wall|стіна
et gulv|a floor|підлога
et tag|a roof|дах
en seng|a bed|ліжко
en sofa|a sofa|диван
en lampe|a lamp|лампа
et spejl|a mirror|дзеркало
et skab|a cupboard|шафа
en hylde|a shelf|полиця
et tæppe|a carpet / a blanket|килим
en pude|a pillow|подушка
et håndklæde|a towel|рушник
en nøgle|a key|ключ
en taske|a bag|сумка
en pung|a wallet|гаманець
en paraply|an umbrella|парасолька
en kuffert|a suitcase|валіза
en kniv|a knife|ніж
en gaffel|a fork|виделка
en ske|a spoon|ложка
en tallerken|a plate|тарілка
et glas|a glass|склянка
en kop|a cup|чашка
en flaske|a bottle|пляшка
en gryde|a pot|каструля
en pande|a frying pan|сковорода
en ovn|an oven|духовка
et køleskab|a fridge|холодильник
en vaskemaskine|a washing machine|пральна машина
en støvsuger|a vacuum cleaner|пилосос
et ur|a clock / a watch|годинник
en telefon|a telephone|телефон
en computer|a computer|комп'ютер
en skærm|a screen|екран
et tastatur|a keyboard|клавіатура
en mus|a mouse|миша
et kamera|a camera|камера
et fjernsyn|a television|телевізор
en radio|a radio|радіо
en avis|a newspaper|газета
et blad|a magazine|журнал
et brev|a letter|лист
et papir|a piece of paper|папір
en blyant|a pencil|олівець
en kuglepen|a pen|ручка
en saks|a pair of scissors|ножиці
en pose|a plastic bag|пакет
en kasse|a box|коробка
en dåse|a tin / a can|банка
et tøj|clothes|одяг
en trøje|a jumper|светр
en skjorte|a shirt|сорочка
en bluse|a blouse|блузка
en bukser|trousers|штани
en kjole|a dress|сукня
en nederdel|a skirt|спідниця
en jakke|a jacket|куртка
en frakke|a coat|пальто
en sko|a shoe|черевик
en støvle|a boot|чобіт
en sok|a sock|шкарпетка
en hat|a hat|капелюх
en hue|a beanie|шапка
en handske|a glove|рукавичка
et halstørklæde|a scarf|шарф
et bælte|a belt|ремінь
en ring|a ring|каблучка
et smykke|a piece of jewellery|прикраса
et måltid|a meal|трапеза
morgenmad|breakfast|сніданок
frokost|lunch|обід
aftensmad|dinner|вечеря
en dessert|a dessert|десерт
kød|meat|м'ясо
en fisk|a fish|риба
en kylling|a chicken|курка
oksekød|beef|яловичина
svinekød|pork|свинина
en pølse|a sausage|ковбаса
et æg|an egg|яйце
ost|cheese|сир
smør|butter|масло
mælk|milk|молоко
fløde|cream|вершки
sukker|sugar|цукор
salt|salt|сіль
peber|pepper|перець
mel|flour|борошно
ris|rice|рис
en kartoffel|a potato|картопля
en grøntsag|a vegetable|овоч
en gulerod|a carrot|морква
et løg|an onion|цибуля
en tomat|a tomato|помідор
en agurk|a cucumber|огірок
en salat|a salad|салат
en frugt|a fruit|фрукт
et æble|an apple|яблуко
en banan|a banana|банан
en appelsin|an orange|апельсин
en pære|a pear|груша
et jordbær|a strawberry|полуниця
en drue|a grape|виноград
en citron|a lemon|лимон
en kage|a cake|торт
en is|an ice cream|морозиво
chokolade|chocolate|шоколад
slik|sweets|цукерки
te|tea|чай
en øl|a beer|пиво
vin|wine|вино
juice|juice|сік
en sodavand|a soft drink|газована вода
naturen|nature|природа
en himmel|a sky|небо
en sky|a cloud|хмара
en stjerne|a star|зірка
en måne|a moon|місяць
jorden|the earth|земля
et hav|a sea|море
en sø|a lake|озеро
en flod|a river|річка
en strand|a beach|пляж
et bjerg|a mountain|гора
en skov|a forest|ліс
et træ|a tree|дерево
en blomst|a flower|квітка
græs|grass|трава
en sten|a stone|камінь
sand|sand|пісок
en vind|a wind|вітер
en storm|a storm|буря
torden|thunder|грім
et lyn|lightning|блискавка
tåge|fog|туман
et dyr|an animal|тварина
en fugl|a bird|птах
en hest|a horse|кінь
en ko|a cow|корова
en gris|a pig|свиня
et får|a sheep|вівця
en rotte|a rat|щур
en ræv|a fox|лисиця
en bjørn|a bear|ведмідь
en løve|a lion|лев
en elefant|an elephant|слон
en slange|a snake|змія
en edderkop|a spider|павук
en myg|a mosquito|комар
en bi|a bee|бджола
en flue|a fly|муха
en sommerfugl|a butterfly|метелик
en landsby|a village|село
en hovedstad|a capital city|столиця
et centrum|a centre|центр
et torv|a market square|ринкова площа
en plads|a square / space|площа
en park|a park|парк
en bro|a bridge|міст
et hjørne|a corner|кут
en bygning|a building|будівля
en kirke|a church|церква
et slot|a castle|замок
et museum|a museum|музей
et bibliotek|a library|бібліотека
et teater|a theatre|театр
en biograf|a cinema|кінотеатр
en restaurant|a restaurant|ресторан
en café|a café|кафе
et hotel|a hotel|готель
et supermarked|a supermarket|супермаркет
et marked|a market|ринок
en bank|a bank|банк
en station|a station|станція
en lufthavn|an airport|аеропорт
en havn|a harbour|порт
et fly|a plane|літак
en bus|a bus|автобус
et skib|a ship|корабель
en båd|a boat|човен
en færge|a ferry|пором
en taxa|a taxi|таксі
en billet|a ticket|квиток
en rejse|a journey|подорож
en ferie|a holiday|відпустка
et kort|a map / a card|карта
en adresse|an address|адреса
et postnummer|a postcode|поштовий індекс
en grænse|a border|кордон
et kontor|an office|офіс
en fabrik|a factory|фабрика
en gård|a farm / a courtyard|ферма
en mark|a field|поле
en virksomhed|a company|компанія
et firma|a firm|фірма
et job|a job|робота
en løn|a salary|зарплата
en aftale|an agreement / an appointment|домовленість
et møde|a meeting|зустріч
et projekt|a project|проєкт
en opgave|a task|завдання
et problem|a problem|проблема
en løsning|a solution|розв'язок
en idé|an idea|ідея
en plan|a plan|план
et mål|a goal|мета
et resultat|a result|результат
en grund|a reason|причина
en årsag|a cause|підстава
en forskel|a difference|різниця
en mulighed|a possibility|можливість
en chance|a chance|шанс
et valg|a choice / an election|вибір
en beslutning|a decision|рішення
en fejl|a mistake|помилка
et forsøg|an attempt|спроба
en erfaring|an experience|досвід
viden|knowledge|знання
en evne|an ability|здатність
en interesse|an interest|інтерес
en mening|an opinion|думка
en tanke|a thought|думка
en følelse|a feeling|почуття
kærlighed|love|кохання
en glæde|joy|радість
en sorg|grief|горе
frygt|fear|страх
vrede|anger|гнів
en overraskelse|a surprise|сюрприз
et håb|hope|надія
en drøm|a dream|мрія
en historie|a story / history|історія
et eventyr|a fairy tale|казка
en sandhed|a truth|правда
en løgn|a lie|брехня
en regel|a rule|правило
en lov|a law|закон
en ret|a right / a dish|право
en pligt|a duty|обов'язок
et ansvar|a responsibility|відповідальність
magt|power|влада
en regering|a government|уряд
et parti|a political party|партія
en stemme|a voice / a vote|голос
en krig|a war|війна
fred|peace|мир
et samfund|a society|суспільство
en kultur|a culture|культура
en religion|a religion|релігія
en gud|a god|бог
et folk|a people|народ
kunst|art|мистецтво
musik|music|музика
en sang|a song|пісня
en film|a film|фільм
en scene|a scene|сцена
et billede|a picture|картинка
en farve|a colour|колір
en form|a shape|форма
en størrelse|a size|розмір
en vægt|a weight|вага
en højde|a height|висота
en længde|a length|довжина
et tal|a number|число
et nummer|a number (of a thing)|номер
en del|a part|частина
et stykke|a piece|шматок
en gruppe|a group|група
et hold|a team|команда
et medlem|a member|член
en liste|a list|список
et eksempel|an example|приклад
et spørgsmål|a question|питання
et svar|an answer|відповідь
en samtale|a conversation|розмова
en besked|a message|повідомлення
en nyhed|a piece of news|новина
en oplysning|a piece of information|інформація
en pris|a price / a prize|ціна
en rabat|a discount|знижка
en regning|a bill|рахунок
en kvittering|a receipt|чек
en skat|a tax / a treasure|податок
et beløb|an amount|сума
en konto|an account|рахунок
en forsikring|an insurance|страхування
en kontrakt|a contract|контракт
en underskrift|a signature|підпис
et pas|a passport|паспорт
et kørekort|a driving licence|водійські права
sikker|safe / certain|безпечний
usikker|unsure|невпевнений
farlig|dangerous|небезпечний
sund|healthy|здоровий
syg|sick|хворий
stærk|strong|сильний
svag|weak|слабкий
tyk|thick / fat|товстий
tynd|thin|тонкий
tung|heavy|важкий
bred|wide|широкий
smal|narrow|вузький
dyb|deep|глибокий
flad|flat|плоский
rund|round|круглий
firkantet|square|квадратний
skæv|crooked|кривий
ren|clean|чистий
beskidt|dirty|брудний
våd|wet|мокрий
tør|dry|сухий
blød|soft|м'який
hård|hard|твердий
glat|smooth / slippery|слизький
skarp|sharp|гострий
fuld|full / drunk|повний
tom|empty|порожній
åben|open|відкритий
lukket|closed|закритий
fri|free|вільний
optaget|occupied|зайнятий
travl|busy|зайнятий
rolig|calm|спокійний
stille|quiet|тихий
larmende|noisy|галасливий
lys|bright|світлий
mørk|dark|темний
klar|clear / ready|ясний
tydelig|clearly visible|чіткий
mærkelig|strange|дивний
almindelig|ordinary|звичайний
sjov|fun / funny|веселий
kedelig|boring|нудний
spændende|exciting|захопливий
interessant|interesting|цікавий
vigtig|important|важливий
nødvendig|necessary|необхідний
mulig|possible|можливий
umulig|impossible|неможливий
nyttig|useful|корисний
gratis|free of charge|безкоштовний
værd|worth|вартий
færdig|finished|готовий
tilfreds|satisfied|задоволений
stolt|proud|гордий
flov|embarrassed|зніяковілий
nervøs|nervous|нервовий
bange|afraid|наляканий
modig|brave|сміливий
vred|angry|злий
sur|sour / grumpy|кислий
sød|sweet / cute|солодкий
bitter|bitter|гіркий
venlig|friendly|привітний
høflig|polite|ввічливий
uhøflig|rude|нечемний
generøs|generous|щедрий
egoistisk|selfish|егоїстичний
ærlig|honest|чесний
klog|clever|розумний
dum|stupid|дурний
doven|lazy|лінивий
flittig|hard-working|працьовитий
forsigtig|careful|обережний
opmærksom|attentive|уважний
nysgerrig|curious|допитливий
genert|shy|сором'язливий
alvorlig|serious|серйозний
skør|crazy|божевільний
vild|wild|дикий
berømt|famous|знаменитий
kendt|well-known|відомий
ukendt|unknown|невідомий
rig|rich|багатий
fattig|poor|бідний
heldig|lucky|везучий
uheldig|unlucky|невезучий
tilfældig|random|випадковий
enig|in agreement|згодний
uenig|in disagreement|незгодний
ens|identical|однаковий
forskellig|different|різний
lignende|similar|подібний
særlig|special|особливий
normal|normal|нормальний
typisk|typical|типовий
sjælden|rare|рідкісний
hyppig|frequent|частий
tidlig|early|ранній
sen|late|пізній
tidligere|previous|попередній
nuværende|current|поточний
lokal|local|місцевий
national|national|національний
international|international|міжнародний
offentlig|public|громадський
privat|private|приватний
personlig|personal|особистий
fælles|shared|спільний
hel|whole|цілий
halv|half|половина
dobbelt|double|подвійний
enkelt|single / simple|простий
kompliceret|complicated|заплутаний
grundig|thorough|ретельний
frisk|fresh|свіжий
rådden|rotten|гнилий
moden|ripe / mature|стиглий
levende|alive|живий
død|dead|мертвий
rød|red|червоний
blå|blue|синій
grøn|green|зелений
gul|yellow|жовтий
sort|black|чорний
hvid|white|білий
grå|grey|сірий
brun|brown|коричневий
lyserød|pink|рожевий
lilla|purple|фіолетовий
orange|orange|оранжевий
elleve|eleven|одинадцять
tolv|twelve|дванадцять
tretten|thirteen|тринадцять
fjorten|fourteen|чотирнадцять
femten|fifteen|п'ятнадцять
seksten|sixteen|шістнадцять
sytten|seventeen|сімнадцять
atten|eighteen|вісімнадцять
nitten|nineteen|дев'ятнадцять
tyve|twenty|двадцять
enogtyve|twenty-one|двадцять один
tredive|thirty|тридцять
fyrre|forty|сорок
halvtreds|fifty|п'ятдесят
tres|sixty|шістдесят
halvfjerds|seventy|сімдесят
firs|eighty|вісімдесят
halvfems|ninety|дев'яносто
en million|a million|мільйон
en halv|a half|половина
en tredjedel|a third|третина
en fjerdedel|a quarter|чверть
anden|second / other|другий
tredje|third|третій
fjerde|fourth|четвертий
femte|fifth|п'ятий
januar|January|січень
februar|February|лютий
marts|March|березень
april|April|квітень
maj|May|травень
juni|June|червень
juli|July|липень
august|August|серпень
september|September|вересень
oktober|October|жовтень
november|November|листопад
december|December|грудень
et forår|a spring|весна
en sommer|a summer|літо
et efterår|an autumn|осінь
en vinter|a winter|зима
en årstid|a season|пора року
i eftermiddag|this afternoon|сьогодні вдень
en eftermiddag|an afternoon|пообіддя
en middag|midday|полудень
midnat|midnight|північ
et sekund|a second|секунда
et øjeblik|a moment|мить
en gang|once / a time|раз
to gange|twice|двічі
en weekend|a weekend|вихідні
en hverdag|a weekday|будній день
en fødselsdag|a birthday|день народження
jul|Christmas|Різдво
påske|Easter|Великдень
en fest|a party|вечірка
en gave|a gift|подарунок
et venskab|a friendship|дружба
nord|north|північ
syd|south|південь
øst|east|схід
vest|west|захід
højre|right (direction)|праворуч
venstre|left|ліворуч
ligeud|straight ahead|прямо
en retning|a direction|напрямок
en afstand|a distance|відстань
en kilometer|a kilometre|кілометр
en meter|a metre|метр
et gram|a gram|грам
et kilo|a kilo|кіло
en liter|a litre|літр
en grad|a degree|градус
Hvordan går det?|How are you?|Як справи?
Det går godt|I'm doing well|Все добре
Hvad hedder du?|What is your name?|Як тебе звати?
Jeg hedder…|My name is…|Мене звати…
Hvor kommer du fra?|Where are you from?|Звідки ти?
Jeg forstår ikke|I don't understand|Я не розумію
Kan du tale langsommere?|Can you speak more slowly?|Можеш говорити повільніше?
Hvad koster det?|How much does it cost?|Скільки це коштує?
Hvor er toilettet?|Where is the toilet?|Де туалет?
Jeg vil gerne have…|I would like…|Мені хотілося б…
Taler du engelsk?|Do you speak English?|Ти розмовляєш англійською?
Vi ses|See you|Побачимось
God morgen|Good morning|Доброго ранку
Godaften|Good evening|Доброго вечора
Godnat|Good night|Добраніч
Held og lykke|Good luck|Удачі
Tillykke|Congratulations|Вітаю
Skål|Cheers|Будьмо
Det gør ikke noget|It doesn't matter|Нічого страшного
Ingen årsag|You're welcome|Нема за що
`;
