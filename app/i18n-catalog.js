/* French + English, Mandarin (simplified) and Hindi. Static, bundled, offline. */
(function(){const rows=`
Votre Ledger, vos comptes.|Your Ledger, your accounts.|您的 Ledger，您的账户。|आपका Ledger, आपके खाते।
Explorez vos soldes et faites vos transactions avec le Ledger.|Explore balances and make transactions with your Ledger.|查看余额并使用 Ledger 进行交易。|अपने Ledger से शेष राशि देखें और लेनदेन करें।
Connecter votre Ledger|Connect your Ledger|连接您的 Ledger|अपना Ledger कनेक्ट करें
Importer des adresses|Import addresses|导入地址|पते आयात करें
Branchez, déverrouillez, ouvrez Ethereum.|Connect, unlock, open Ethereum.|连接设备、解锁并打开 Ethereum 应用。|कनेक्ट करें, अनलॉक करें, Ethereum खोलें।
Le PIN se saisit uniquement sur le Ledger.|Enter the PIN on the Ledger only.|仅在 Ledger 设备上输入 PIN。|PIN केवल Ledger पर दर्ज करें।
Lire le Ledger USB|Read Ledger via USB|通过 USB 读取 Ledger|USB से Ledger पढ़ें
Adresses par chemin|Addresses per path|每个路径的地址数量|प्रति पथ पते
Chemin personnalisé|Custom path|自定义路径|कस्टम पथ
Lire une phrase de récupération · lecture seule|Read a recovery phrase · read only|读取恢复短语 · 只读|रिकवरी वाक्यांश पढ़ें · केवल पढ़ने हेतु
Génération locale|Local generation|本地生成|स्थानीय जनरेशन
Phrase de récupération / seed|Recovery phrase / seed|恢复短语 / 种子|रिकवरी वाक्यांश / सीड
12, 15, 18, 21 ou 24 mots|12, 15, 18, 21 or 24 words|12、15、18、21 或 24 个单词|12, 15, 18, 21 या 24 शब्द
Afficher temporairement|Show temporarily|临时显示|अस्थायी रूप से दिखाएँ
Langue des mots|Phrase language|短语语言|वाक्यांश की भाषा
Détection automatique|Auto-detect|自动检测|अपने आप पहचानें
Anglais|English|英语|अंग्रेज़ी
Français|French|法语|फ़्रेंच
Espagnol|Spanish|西班牙语|स्पेनी
Italien|Italian|意大利语|इतालवी
Portugais|Portuguese|葡萄牙语|पुर्तगाली
Japonais|Japanese|日语|जापानी
Coréen|Korean|韩语|कोरियाई
Chinois simplifié|Simplified Chinese|简体中文|सरलीकृत चीनी
Chinois traditionnel|Traditional Chinese|繁体中文|पारंपरिक चीनी
Tchèque|Czech|捷克语|चेक
Passphrase BIP39 facultative|Optional BIP39 passphrase|可选 BIP39 附加密码|वैकल्पिक BIP39 पासफ़्रेज़
Laisser vide si inutilisée|Leave empty if unused|如未使用请留空|यदि उपयोग नहीं किया तो खाली छोड़ें
Formats et compatibilité avancés|Advanced formats and compatibility|高级格式与兼容性|उन्नत प्रारूप और अनुकूलता
Format|Format|格式|प्रारूप
BIP39 avec validation|BIP39 with validation|验证 BIP39|सत्यापन सहित BIP39
PBKDF2 sans validation|PBKDF2 without validation|不验证的 PBKDF2|बिना सत्यापन PBKDF2
Seed BIP32 hexadécimale|Hexadecimal BIP32 seed|十六进制 BIP32 种子|हेक्साडेसिमल BIP32 सीड
Choisissez le format du portefeuille d’origine.|Choose the original wallet format.|选择原钱包使用的格式。|मूल वॉलेट का प्रारूप चुनें।
Compléter les préfixes uniques de 4 lettres|Expand unique 4-letter prefixes|补全唯一的四字母前缀|अद्वितीय 4-अक्षर उपसर्ग पूरे करें
Dernier mot comme passphrase|Use last word as passphrase|将最后一个词用作附加密码|अंतिम शब्द को पासफ़्रेज़ बनाएँ
Itérations PBKDF2|PBKDF2 iterations|PBKDF2 迭代次数|PBKDF2 पुनरावृत्तियाँ
Générer les adresses|Generate addresses|生成地址|पते जनरेट करें
Prêt à lire votre Ledger.|Ready to read your Ledger.|已准备好读取您的 Ledger。|आपका Ledger पढ़ने के लिए तैयार।
Tout copier|Copy all|全部复制|सब कॉपी करें
Exporter les adresses|Export addresses|导出地址|पते निर्यात करें
Tout effacer|Clear all|全部清除|सब मिटाएँ
Contrôler les soldes|Check balances|检查余额|शेष राशि जाँचें
Vérifier les soldes|Check balances|检查余额|शेष राशि जाँचें
Arrêter|Stop|停止|रोकें
Réglages de vérification|Balance check settings|余额检查设置|शेष जाँच सेटिंग
Serveur Ethereum RPC|Ethereum RPC server|Ethereum RPC 服务器|Ethereum RPC सर्वर
ERC20 à rechercher|ERC20 tokens to check|要检查的 ERC20 代币|जाँचने के लिए ERC20
Personnaliser les ERC20|Customize ERC20 tokens|自定义 ERC20 代币|ERC20 अनुकूलित करें
Contrats supplémentaires · recherche seule|Extra contracts · balance checks only|额外合约 · 仅检查余额|अतिरिक्त अनुबंध · केवल शेष जाँच
Contrats ERC20 supplémentaires|Additional ERC20 contracts|额外 ERC20 合约|अतिरिक्त ERC20 अनुबंध
Estimer la valeur en dollars|Estimate value in dollars|估算美元价值|डॉलर में मूल्य का अनुमान
Rechercher les transactions et transferts|Check transactions and transfers|检查交易与转账|लेनदेन और ट्रांसफ़र जाँचें
Vos comptes|Your accounts|您的账户|आपके खाते
Exporter CSV|Export CSV|导出 CSV|CSV निर्यात करें
valeur estimée en $ · ETH + ERC20|estimated value in $ · ETH + ERC20|估算美元价值 · ETH + ERC20|अनुमानित डॉलर मूल्य · ETH + ERC20
valeur estimée en $ · partielle|estimated value in $ · partial|估算美元价值 · 不完整|अनुमानित डॉलर मूल्य · आंशिक
adresses uniques|unique addresses|唯一地址|अद्वितीय पते
ETH observés|ETH observed|已查得 ETH|देखे गए ETH
adresses avec solde|addresses with a balance|有余额的地址|शेष राशि वाले पते
adresses contrôlées|addresses checked|已检查地址|जाँचे गए पते
Cours en dollars non consultés.|Dollar prices not checked.|尚未查询美元价格。|डॉलर मूल्य नहीं जाँचे गए।
Commencez par lire votre Ledger.|Start by reading your Ledger.|请先读取您的 Ledger。|पहले अपना Ledger पढ़ें।
Copier les affichées|Copy visible addresses|复制显示的地址|दिखाए गए पते कॉपी करें
Soldes positifs|Positive balances|非零余额|सकारात्मक शेष
Avec transactions|With transactions|有交易记录|लेनदेन वाले
Erreurs / non contrôlées|Errors / unchecked|错误 / 未检查|त्रुटि / बिना जाँच
Actualiser le bloc et les soldes|Refresh block and balances|刷新区块和余额|ब्लॉक और शेष राशि ताज़ा करें
Transactions de cette session|Transactions in this session|本次会话的交易|इस सत्र के लेनदेन
Mode / index|Mode / index|模式 / 索引|मोड / क्रमांक
Adresse / chemin|Address / path|地址 / 路径|पता / पथ
ETH / compte en $|ETH / account value in $|ETH / 账户美元价值|ETH / खाते का डॉलर मूल्य
Transactions|Transactions|交易|लेनदेन
État|Status|状态|स्थिति
Les adresses apparaîtront ici.|Addresses will appear here.|地址将在此处显示。|पते यहाँ दिखाई देंगे।
Signatures sur le Ledger uniquement · aucune télémétrie intégrée|Ledger signatures only · no built-in telemetry|仅在 Ledger 上签名 · 无内置遥测|हस्ताक्षर केवल Ledger पर · कोई अंतर्निहित टेलीमेट्री नहीं
Faire une transaction|Make a transaction|进行交易|लेनदेन करें
SIGNATURE LEDGER · ETHEREUM MAINNET|LEDGER SIGNATURE · ETHEREUM MAINNET|LEDGER 签名 · ETHEREUM 主网|LEDGER हस्ताक्षर · ETHEREUM मुख्य नेटवर्क
Fermer|Close|关闭|बंद करें
Actif à envoyer|Asset to send|发送的资产|भेजी जाने वाली संपत्ति
Chemin de cette adresse|Path for this address|此地址的路径|इस पते का पथ
Adresse du destinataire|Recipient address|收款地址|प्राप्तकर्ता का पता
Montant|Amount|金额|राशि
Voir le récapitulatif et les frais|Review transfer and fees|查看交易摘要和费用|सारांश और शुल्क देखें
Vérifiez votre transfert|Review your transfer|确认转账信息|अपना ट्रांसफ़र जाँचें
Le destinataire est un contrat : vérifiez que cette adresse accepte le token choisi.|The recipient is a contract: check that it accepts this token.|收款地址为合约：请确认它支持接收此代币。|प्राप्तकर्ता एक अनुबंध है: जाँचें कि वह यह टोकन स्वीकार करता है।
Vérifiez le destinataire, le montant et les frais sur le Ledger avant de confirmer.|Check recipient, amount and fees on your Ledger before confirming.|确认前，请在 Ledger 上核对收款地址、金额和费用。|पुष्टि से पहले Ledger पर प्राप्तकर्ता, राशि और शुल्क जाँचें।
Modifier|Edit|修改|बदलें
Signer sur le Ledger et envoyer|Sign on Ledger and send|在 Ledger 上签名并发送|Ledger पर हस्ताक्षर करके भेजें
Voir la transaction sur Etherscan ↗|View transaction on Etherscan ↗|在 Etherscan 查看交易 ↗|Etherscan पर लेनदेन देखें ↗
Voir sur Etherscan ↗|View on Etherscan ↗|在 Etherscan 上查看 ↗|Etherscan पर देखें ↗
Actualiser le suivi|Refresh status|刷新状态|स्थिति ताज़ा करें
Informations|Information|说明|जानकारी
Langue de l’interface|Interface language|界面语言|इंटरफ़ेस की भाषा
Ajouter un contrat Ethereum|Add an Ethereum contract|添加 Ethereum 合约|Ethereum अनुबंध जोड़ें
Ajouter|Add|添加|जोड़ें
Token|Token|代币|टोकन
Recherche|Balance check|余额检查|शेष जाँच
Transaction|Transaction|交易|लेनदेन
Rétablir les ERC20 par défaut|Restore default ERC20 tokens|恢复默认 ERC20 代币|डिफ़ॉल्ट ERC20 बहाल करें
Retirer ce token|Remove this token|移除此代币|यह टोकन हटाएँ
Descriptif Ledger indisponible|Ledger descriptor unavailable|Ledger 描述信息不可用|Ledger विवरण उपलब्ध नहीं
Vos choix sont enregistrés sur cet ordinateur.|Your choices are saved on this computer.|您的选择保存在此电脑上。|आपके विकल्प इस कंप्यूटर पर सहेजे जाते हैं।
Ajout et vérification du contrat…|Adding and checking the contract…|正在添加并验证合约…|अनुबंध जोड़ा और जाँचा जा रहा है…
ERC20 ajouté. Vos choix sont enregistrés.|ERC20 added. Your choices are saved.|ERC20 已添加，您的选择已保存。|ERC20 जुड़ गया। आपके विकल्प सहेजे गए।
Choix enregistrés.|Choices saved.|选择已保存。|विकल्प सहेजे गए।
Sélection par défaut rétablie.|Default selection restored.|已恢复默认选择。|डिफ़ॉल्ट चयन बहाल हुआ।
Réseau|Network|网络|नेटवर्क
Ethereum mainnet · réseau 1|Ethereum mainnet · network 1|Ethereum 主网 · 网络 1|Ethereum मुख्य नेटवर्क · नेटवर्क 1
Depuis|From|发件地址|प्रेषक
Vers|To|收款地址|प्राप्तकर्ता
Contrat ERC20|ERC20 contract|ERC20 合约|ERC20 अनुबंध
Frais estimés|Estimated fees|估算费用|अनुमानित शुल्क
Plafond des frais|Maximum fees|费用上限|अधिकतम शुल्क
Débit maximal en ETH|Maximum ETH debit|最大 ETH 支出|अधिकतम ETH कटौती
Chemin Ledger|Ledger path|Ledger 路径|Ledger पथ
Préparation valable jusqu’à|Preparation valid until|准备信息有效期至|तैयारी की वैधता
Montant libre|Custom amount|自定义金额|मनचाही राशि
Solde disponible calculé à la préparation|Available balance calculated when preparing|准备交易时计算可用余额|तैयारी पर उपलब्ध शेष की गणना होगी
Diffusée · en attente de confirmation|Broadcast · awaiting confirmation|已广播 · 等待确认|प्रसारित · पुष्टि की प्रतीक्षा
Diffusion incertaine · vérifiez avant tout nouvel envoi|Broadcast uncertain · check before sending again|广播状态不确定 · 再次发送前请先核实|प्रसारण अनिश्चित · दोबारा भेजने से पहले जाँचें
Confirmée sur Ethereum|Confirmed on Ethereum|已在 Ethereum 上确认|Ethereum पर पुष्टि हुई
Échouée sur Ethereum · des frais ont pu être prélevés|Failed on Ethereum · fees may have been charged|Ethereum 上执行失败 · 可能已扣除费用|Ethereum पर विफल · शुल्क लग सकता है
Choisissez le destinataire et le montant. Le Ledger sera sollicité à l’étape suivante.|Choose recipient and amount. Your Ledger is used at the next step.|选择收款地址和金额，下一步将使用 Ledger。|प्राप्तकर्ता और राशि चुनें। अगले चरण में Ledger का उपयोग होगा।
Modifiez le transfert puis actualisez le récapitulatif.|Edit the transfer, then refresh the summary.|修改转账后，请更新摘要。|ट्रांसफ़र बदलें, फिर सारांश ताज़ा करें।
Actualisation des soldes, simulation du transfert et estimation des frais…|Updating balances, simulating transfer and estimating fees…|正在更新余额、模拟转账并估算费用…|शेष अपडेट, ट्रांसफ़र सिमुलेशन और शुल्क का अनुमान जारी…
Comparez l’adresse et le montant avec votre intention. Vous les vérifierez ensuite sur le Ledger.|Check the intended address and amount. Then verify them on your Ledger.|核对目标地址和金额，然后在 Ledger 上再次确认。|पता और राशि अपनी मंशा से मिलाएँ। फिर Ledger पर जाँचें।
Déverrouillez le Ledger, ouvrez Ethereum et vérifiez le destinataire, le montant et les frais sur son écran. Confirmez uniquement si tout correspond.|Unlock Ledger, open Ethereum, and check recipient, amount and fees on its screen. Confirm only if everything matches.|解锁 Ledger，打开 Ethereum，并在设备上核对收款地址、金额和费用。仅在全部一致时确认。|Ledger अनलॉक करें, Ethereum खोलें और स्क्रीन पर प्राप्तकर्ता, राशि व शुल्क जाँचें। सब सही होने पर ही पुष्टि करें।
Signature vérifiée. Diffusion de cette transaction sur Ethereum…|Signature verified. Broadcasting this transaction on Ethereum…|签名已验证，正在向 Ethereum 广播此交易…|हस्ताक्षर सत्यापित। Ethereum पर लेनदेन प्रसारित हो रहा है…
La transaction est envoyée. Son suivi reste disponible dans les transactions de cette session.|Transaction sent. Track it in this session’s transaction history.|交易已发送，可在本次会话的交易记录中跟踪。|लेनदेन भेजा गया। इस सत्र के लेनदेन में स्थिति देखें।
Signature annulée. Aucune diffusion n’a été lancée.|Signature cancelled. Nothing was broadcast.|签名已取消，未广播任何交易。|हस्ताक्षर रद्द हुआ। कोई प्रसारण नहीं हुआ।
Transaction refusée sur le Ledger. Aucun envoi.|Transaction rejected on Ledger. Nothing sent.|交易已在 Ledger 上拒绝，未发送。|Ledger पर लेनदेन अस्वीकृत। कुछ नहीं भेजा गया।
Signature Ledger impossible.|Unable to sign with Ledger.|无法使用 Ledger 签名。|Ledger से हस्ताक्षर संभव नहीं।
Catalogue de transferts indisponible.|Transfer asset list unavailable.|可转账资产列表不可用。|ट्रांसफ़र संपत्ति सूची उपलब्ध नहीं।
Passer en mode jour|Switch to day mode|切换为日间模式|दिन मोड करें
Passer en mode nuit|Switch to night mode|切换为夜间模式|रात मोड करें
Copier|Copy|复制|कॉपी करें
Copié !|Copied!|已复制！|कॉपी हुआ!
Non contrôlé|Unchecked|未检查|जाँचा नहीं गया
Vérifié|Checked|已检查|जाँचा गया
Incomplet|Incomplete|不完整|अधूरा
Erreur|Error|错误|त्रुटि
Non demandé|Not requested|未请求|अनुरोध नहीं किया गया
Estimation partielle|Partial estimate|部分估算|आंशिक अनुमान
Compte : $ inconnu|Account: $ unknown|账户：美元价值未知|खाता: डॉलर मूल्य अज्ञात
Aucune ligne pour ces filtres.|No rows match these filters.|没有符合筛选条件的结果。|इन फ़िल्टर से कोई पंक्ति नहीं मिली।
Prêt pour la génération locale.|Ready for local generation.|已准备好本地生成。|स्थानीय जनरेशन के लिए तैयार।
Adresses et champs secrets effacés de l’interface.|Addresses and secret fields cleared from the interface.|已清除界面中的地址和敏感字段。|इंटरफ़ेस से पते और गोपनीय फ़ील्ड मिटाए गए।
Choisissez un nombre entier entre 1 et 10000 adresses par chemin.|Choose 1 to 10000 whole addresses per path.|每个路径请选择 1 至 10000 个地址的整数数量。|प्रति पथ 1 से 10000 तक पूर्ण संख्या चुनें।
Saisissez votre phrase ou votre seed.|Enter your phrase or seed.|请输入短语或种子。|अपना वाक्यांश या सीड दर्ज करें।
Sélectionnez au moins un chemin.|Select at least one path.|请至少选择一个路径。|कम से कम एक पथ चुनें।
Génération locale en cours…|Generating locally…|正在本地生成…|स्थानीय जनरेशन जारी…
Branchez le Ledger en USB, déverrouillez-le sur son écran et ouvrez Ethereum…|Connect Ledger via USB, unlock it on the device and open Ethereum…|通过 USB 连接 Ledger，在设备上解锁并打开 Ethereum…|Ledger को USB से जोड़ें, डिवाइस पर अनलॉक करें और Ethereum खोलें…
Adresses publiques lues sur le Ledger USB. Seed et clés privées restent sur l’appareil.|Public addresses read from Ledger USB. Seed and private keys stay on the device.|已通过 USB 读取 Ledger 公共地址，种子和私钥保留在设备中。|USB से Ledger के सार्वजनिक पते पढ़े गए। सीड और निजी कुंजियाँ डिवाइस पर रहती हैं।
Vérification du réseau Ethereum et du bloc…|Checking Ethereum network and block…|正在检查 Ethereum 网络和区块…|Ethereum नेटवर्क और ब्लॉक की जाँच…
Génération arrêtée.|Generation stopped.|已停止生成。|जनरेशन रुका।
Arrêt du contrôle…|Stopping balance check…|正在停止检查…|शेष जाँच रोकी जा रही है…
Export enregistré : adresses et résultats publics uniquement.|Export saved: public addresses and results only.|导出已保存：仅包含公共地址和结果。|निर्यात सहेजा गया: केवल सार्वजनिक पते और परिणाम।
Etherscan ouvert dans votre navigateur pour cette adresse publique.|Etherscan opened in your browser for this public address.|已在浏览器中打开此公共地址的 Etherscan 页面。|इस सार्वजनिक पते के लिए ब्राउज़र में Etherscan खुला।
{0} mot|{0} word|{0} 个词|{0} शब्द
{0} mots|{0} words|{0} 个词|{0} शब्द
Bloc {0}|Block {0}|区块 {0}|ब्लॉक {0}
Compte ≈ {0}|Account ≈ {0}|账户 ≈ {0}|खाता ≈ {0}
{0} ERC20 à zéro|{0} ERC20 tokens at zero|{0} 种 ERC20 余额为零|{0} ERC20 का शेष शून्य
{0} lecture(s) inconnue(s)|{0} unknown read(s)|{0} 项读取结果未知|{0} जाँच परिणाम अज्ञात
Détail des {0} tokens|Details of {0} tokens|{0} 种代币的详情|{0} टोकन का विवरण
Lecture Ledger : {0} / {1} chemins…|Reading Ledger: {0} / {1} paths…|正在读取 Ledger：{0} / {1} 个路径…|Ledger पढ़ा जा रहा है: {0} / {1} पथ…
Génération locale : {0} adresses…|Local generation: {0} addresses…|本地生成：{0} 个地址…|स्थानीय जनरेशन: {0} पते…
Contrôle en cours : {0} / {1} adresses.|Checking: {0} / {1} addresses.|正在检查：{0} / {1} 个地址。|जाँच जारी: {0} / {1} पते।
Contrôle de {0} adresses uniques au bloc {1}…|Checking {0} unique addresses at block {1}…|正在区块 {1} 检查 {0} 个唯一地址…|ब्लॉक {1} पर {0} अद्वितीय पते जाँचे जा रहे हैं…
{0} adresses uniques lues sur le Ledger. Prêt pour l’export ou la vérification des soldes.|{0} unique addresses read from Ledger. Ready to export or check balances.|已从 Ledger 读取 {0} 个唯一地址，可导出或检查余额。|Ledger से {0} अद्वितीय पते पढ़े गए। निर्यात या शेष जाँच के लिए तैयार।
{0} adresses uniques générées, {1} chemins associés. Prêt pour l’export ou la vérification.|{0} unique addresses generated, {1} associated paths. Ready to export or check.|已生成 {0} 个唯一地址，关联 {1} 个路径，可导出或检查。|{0} अद्वितीय पते जनरेट हुए, {1} संबंधित पथ। निर्यात या जाँच के लिए तैयार।
{0} adresses publiques importées. Aucun secret nécessaire pour vérifier les soldes.|{0} public addresses imported. No secrets needed to check balances.|已导入 {0} 个公共地址，检查余额无需敏感信息。|{0} सार्वजनिक पते आयात हुए। शेष जाँच के लिए कोई गोपनीय जानकारी नहीं चाहिए।
Contrôle terminé : {0} adresses, {1} avec contrôle incomplet. Les totaux portent uniquement sur les valeurs obtenues.|Check complete: {0} addresses, {1} incomplete. Totals include only retrieved values.|检查完成：{0} 个地址，{1} 个不完整。总计仅包含已获取的数据。|जाँच पूरी: {0} पते, {1} अधूरे। कुल में केवल प्राप्त मान हैं।
Solde observé : {0} {1} · le solde et les frais seront actualisés avant signature.|Observed balance: {0} {1} · balance and fees refresh before signing.|已查得余额：{0} {1} · 签名前将更新余额和费用。|देखा गया शेष: {0} {1} · हस्ताक्षर से पहले शेष और शुल्क अपडेट होंगे।
{0} · inconnu|{0} · unknown|{0} · 未知|{0} · अज्ञात
Cours indicatifs DefiLlama consultés le {0} · {1} actifs cotés.|Indicative DefiLlama prices checked on {0} · {1} priced assets.|DefiLlama 参考价格查询于 {0} · {1} 种已定价资产。|DefiLlama के सांकेतिक मूल्य {0} को जाँचे गए · {1} संपत्तियों के मूल्य।
`;globalThis.TranslationCatalog={};for(const line of rows.trim().split('\n')){const parts=line.split('|');if(parts.length!==4)throw Error('Translation row: '+line);TranslationCatalog[parts[0]]=parts.slice(1);}})();

(function(){const rows=`
Votre Ledger|Your Ledger|您的 Ledger|आपका Ledger
Lecture des phrases|Reading recovery phrases|读取恢复短语|रिकवरी वाक्यांश पढ़ना
Chemins de dérivation|Derivation paths|派生路径|व्युत्पत्ति पथ
Compatibilité avancée|Advanced compatibility|高级兼容性|उन्नत अनुकूलता
Confidentialité|Privacy|隐私|गोपनीयता
Périmètre de la recherche|Balance check scope|余额检查范围|शेष जाँच का दायरा
Lire les résultats|Reading the results|理解结果|परिणाम समझें
Actualiser le bloc|Refresh the block|刷新区块|ब्लॉक ताज़ा करें
Gas et frais|Gas and fees|Gas 与费用|गैस और शुल्क
Destinataire|Recipient|收款人|प्राप्तकर्ता
Vos ERC20|Your ERC20 tokens|您的 ERC20 代币|आपके ERC20 टोकन
Informations sur le Ledger|Ledger information|Ledger 说明|Ledger की जानकारी
Informations sur les chemins|Path information|路径说明|पथ की जानकारी
Informations sur les phrases|Recovery phrase information|恢复短语说明|रिकवरी वाक्यांश की जानकारी
Informations sur les formats|Format information|格式说明|प्रारूप की जानकारी
Informations sur la confidentialité|Privacy information|隐私说明|गोपनीयता की जानकारी
Informations sur les résultats|Results information|结果说明|परिणाम की जानकारी
Informations sur le bloc|Block information|区块说明|ब्लॉक की जानकारी
Informations sur les frais|Fee information|费用说明|शुल्क की जानकारी
Informations sur le destinataire|Recipient information|收款人说明|प्राप्तकर्ता की जानकारी
Informations sur les ERC20|ERC20 information|ERC20 说明|ERC20 की जानकारी
Branchez le Ledger, saisissez le PIN sur l’appareil et ouvrez Ethereum. La lecture des adresses ne demande pas de confirmation. Chaque transaction doit être confirmée sur le Ledger. La phrase et les clés privées restent sur l’appareil.|Connect Ledger, enter the PIN on the device and open Ethereum. Reading addresses needs no confirmation. Every transaction must be confirmed on Ledger. The recovery phrase and private keys stay on the device.|连接 Ledger，在设备上输入 PIN 并打开 Ethereum。读取地址无需确认，每笔交易都必须在 Ledger 上确认。恢复短语和私钥保留在设备上。|Ledger जोड़ें, डिवाइस पर PIN दर्ज करें और Ethereum खोलें। पते पढ़ने के लिए पुष्टि नहीं चाहिए। प्रत्येक लेनदेन की पुष्टि Ledger पर करनी होगी। रिकवरी वाक्यांश और निजी कुंजियाँ डिवाइस पर रहती हैं।
Cette option génère les adresses localement. Elle ne permet aucune transaction. Ne saisissez que vos propres phrases ; privilégiez le Ledger pour un portefeuille matériel. Une phrase saisie sur un ordinateur est exposée à cet ordinateur.|This option generates addresses locally and cannot make transactions. Enter only your own phrases; use Ledger for a hardware wallet. A phrase entered on a computer is exposed to that computer.|此选项仅在本地生成地址，不能进行交易。只输入您自己的恢复短语；硬件钱包请优先使用 Ledger。在电脑上输入的短语会暴露给该电脑。|यह विकल्प पते स्थानीय रूप से बनाता है और लेनदेन नहीं कर सकता। केवल अपने वाक्यांश दर्ज करें; हार्डवेयर वॉलेट के लिए Ledger का उपयोग करें। कंप्यूटर में दर्ज वाक्यांश उस कंप्यूटर के संपर्क में आता है।
Le nombre choisi s’applique à chaque chemin, de 1 à 10000. BIP44 est le chemin standard. Les adresses communes sont regroupées. Un chemin personnalisé utilise {i} pour l’indice variable ; le Ledger peut refuser certains chemins.|The selected count applies to each path, from 1 to 10000. BIP44 is the standard path. Shared addresses are merged. Custom paths use {i} for the variable index; Ledger may reject some paths.|所选数量适用于每个路径，范围为 1 至 10000。BIP44 是标准路径。相同地址会合并显示。自定义路径用 {i} 表示可变索引，Ledger 可能拒绝某些路径。|चुनी संख्या प्रत्येक पथ पर लागू है, 1 से 10000 तक। BIP44 मानक पथ है। समान पते एक साथ दिखते हैं। कस्टम पथ में बदलते क्रमांक के लिए {i} है; Ledger कुछ पथ अस्वीकार कर सकता है।
BIP39 valide les mots et le checksum dans dix langues. PBKDF2 sans validation et la seed BIP32 sont réservés aux formats historiques connus. Une passphrase ou des itérations différentes donnent d’autres adresses. Aucun mot n’est deviné.|BIP39 validates words and checksum in ten languages. Unvalidated PBKDF2 and BIP32 seeds are for known historical formats. A different passphrase or iteration count produces different addresses. No words are guessed.|BIP39 可验证十种语言的单词和校验和。未验证的 PBKDF2 与 BIP32 种子仅适用于已知历史格式。不同附加密码或迭代次数会生成不同地址。不会猜测单词。|BIP39 दस भाषाओं में शब्द और चेकसम सत्यापित करता है। बिना सत्यापन PBKDF2 और BIP32 सीड ज्ञात पुराने प्रारूपों के लिए हैं। अलग पासफ़्रेज़ या पुनरावृत्तियाँ अलग पते देती हैं। शब्दों का अनुमान नहीं लगाया जाता।
Les phrases sont traitées localement. Les serveurs RPC et d’historique reçoivent les adresses consultées et votre IP de sortie. Les transactions signées sont publiques. Aucun service de télémétrie n’est intégré.|Phrases are processed locally. RPC and history providers receive queried addresses and your outgoing IP. Signed transactions are public. No telemetry service is built in.|短语在本地处理。RPC 和历史记录服务会收到查询地址和您的出口 IP。已签名交易是公开的。本软件不含遥测服务。|वाक्यांश स्थानीय रूप से संसाधित होते हैं। RPC और इतिहास प्रदाता पूछे गए पते व आपकी बाहरी IP प्राप्त करते हैं। हस्ताक्षरित लेनदेन सार्वजनिक हैं। कोई टेलीमेट्री सेवा नहीं है।
Ethereum uniquement : ETH et les ERC20 sélectionnés. Les NFT, autres réseaux et positions DeFi ne sont pas inventoriés. Les cours en dollars sont indicatifs. Une erreur reste un solde inconnu.|Ethereum only: ETH and selected ERC20 tokens. NFTs, other networks and DeFi positions are not inventoried. Dollar prices are indicative. An error remains an unknown balance.|仅限 Ethereum：ETH 与所选 ERC20。不会列出 NFT、其他网络或 DeFi 仓位。美元价格仅供参考。读取失败代表余额未知。|केवल Ethereum: ETH और चुने ERC20। NFT, अन्य नेटवर्क और DeFi स्थितियाँ सूचीबद्ध नहीं हैं। डॉलर मूल्य सांकेतिक हैं। त्रुटि का अर्थ शेष अज्ञात है।
0 signifie un solde vérifié nul ; — signifie inconnu ou non contrôlé. Le filtre transactions inclut les envois, réceptions et transferts indexés. Les icônes Blockies sont calculées localement. Les totaux peuvent être partiels.|0 means a checked zero balance; — means unknown or unchecked. The transaction filter includes indexed sends, receipts and transfers. Blockies icons are computed locally. Totals may be partial.|0 表示已验证余额为零；— 表示未知或未检查。交易筛选包含已索引的发送、接收和转账。Blockies 图标在本地计算。总计可能不完整。|0 का अर्थ सत्यापित शून्य शेष; — अज्ञात या बिना जाँच है। लेनदेन फ़िल्टर में अनुक्रमित भेजना, प्राप्ति और ट्रांसफ़र शामिल हैं। Blockies स्थानीय रूप से बनते हैं। कुल आंशिक हो सकता है।
Le bouton ↻ relance la vérification au dernier bloc disponible. Les soldes sont relus au même bloc : le numéro affiché correspond ainsi aux résultats. Cela ne modifie pas une transaction déjà préparée.|The ↻ button reruns the check at the latest available block. Balances use that same block, so the displayed number matches the results. This does not change an already prepared transaction.|↻ 按钮会在最新可用区块重新检查余额。余额统一按该区块读取，因此显示的区块号与结果一致。这不会修改已经准备好的交易。|↻ बटन नवीनतम उपलब्ध ब्लॉक पर जाँच दोहराता है। शेष उसी ब्लॉक पर पढ़े जाते हैं, इसलिए दिखाया क्रमांक परिणामों से मेल खाता है। पहले से तैयार लेनदेन नहीं बदलता।
Le RPC estime le gas. La V2 ajoute 20 % de marge, sauf pour un transfert ETH simple à 21 000 unités. Le plafond du prix est deux fois les frais de base plus le pourboire. Seul le gas réellement consommé est facturé. Max réserve le plafond des frais ; un reste d’ETH est possible.|The RPC estimates gas. V2 adds a 20% margin except for a simple 21,000-unit ETH transfer. The price cap is twice the base fee plus the tip. Only gas actually used is charged. Max reserves the fee cap; some ETH may remain.|RPC 负责估算 Gas。除 21,000 单位的普通 ETH 转账外，V2 增加 20% 余量。价格上限为基础费用的两倍加小费。仅对实际消耗的 Gas 收费。Max 会预留费用上限，因此可能剩余少量 ETH。|RPC गैस का अनुमान देता है। साधारण 21,000 इकाई ETH ट्रांसफ़र के अलावा V2 में 20% अतिरिक्त सीमा है। मूल्य सीमा आधार शुल्क का दुगना और टिप है। केवल उपयोग हुई गैस का शुल्क लगता है। Max अधिकतम शुल्क आरक्षित करता है; कुछ ETH बच सकता है।
Collez une adresse Ethereum complète. Vérifiez-la dans le récapitulatif puis sur le Ledger. Les noms ENS ne sont pas résolus. Les transferts ETH vers des contrats ne sont pas pris en charge dans cette version.|Paste a full Ethereum address. Check it in the summary and on Ledger. ENS names are not resolved. ETH transfers to contracts are not supported in this version.|粘贴完整的 Ethereum 地址，并在摘要和 Ledger 上核对。本版本不解析 ENS 名称，也不支持向合约发送 ETH。|पूरा Ethereum पता पेस्ट करें। सारांश और Ledger पर जाँचें। ENS नाम नहीं सुलझाए जाते। इस संस्करण में अनुबंधों को ETH भेजना समर्थित नहीं है।
Les 25 tokens de recherche et les 19 ERC20 de transaction restent sélectionnés par défaut. Ajoutez un contrat Ethereum pour le personnaliser. Un token ne peut être envoyé que si son descriptif signé est pris en charge par le Ledger. Vos choix et la langue sont enregistrés localement, sans phrase ni adresse de compte.|The 25 search tokens and 19 transfer ERC20 tokens stay selected by default. Add an Ethereum contract to customize the list. A token can be sent only if its signed descriptor is supported by Ledger. Your choices and language are saved locally, without phrases or wallet addresses.|默认选择仍为 25 种检查代币和 19 种可转账 ERC20。添加 Ethereum 合约可自定义列表。只有 Ledger 支持其签名描述信息的代币才能发送。您的选择和语言保存在本地，不保存恢复短语或账户地址。|डिफ़ॉल्ट रूप से वही 25 जाँच टोकन और 19 ट्रांसफ़र ERC20 चुने रहते हैं। सूची बदलने के लिए Ethereum अनुबंध जोड़ें। केवल Ledger के समर्थित हस्ताक्षरित विवरण वाले टोकन भेजे जा सकते हैं। विकल्प और भाषा स्थानीय रूप से सहेजते हैं, वाक्यांश या खाता पते नहीं।
Recherche {0}|Check {0}|检查 {0}|{0} की जाँच
Transaction {0}|Transfer {0}|转账 {0}|{0} का लेनदेन
Copier l’adresse {0}|Copy address {0}|复制地址 {0}|पता {0} कॉपी करें
Ouvrir {0} sur Etherscan|Open {0} on Etherscan|在 Etherscan 上打开 {0}|{0} को Etherscan पर खोलें
1 adresse publique copiée. Collez avec Ctrl+V dans la recherche Etherscan.|1 public address copied. Paste it into Etherscan with Ctrl+V.|已复制 1 个公共地址，请使用 Ctrl+V 粘贴到 Etherscan 搜索。|1 सार्वजनिक पता कॉपी हुआ। Etherscan में Ctrl+V से पेस्ट करें।
{0} adresses publiques copiées. Une adresse par ligne, à coller dans un fichier texte.|{0} public addresses copied. One address per line, ready to paste into a text file.|已复制 {0} 个公共地址，每行一个，可粘贴到文本文件。|{0} सार्वजनिक पते कॉपी हुए। प्रति पंक्ति एक पता, टेक्स्ट फ़ाइल में पेस्ट करें।
La copie a échoué. Sélectionnez le texte de l’adresse puis faites Ctrl+C.|Copy failed. Select the address and press Ctrl+C.|复制失败，请选中地址文本并按 Ctrl+C。|कॉपी विफल। पता चुनें और Ctrl+C दबाएँ।
Impossible d’ouvrir Etherscan. Copiez l’adresse puis collez-la sur etherscan.io.|Unable to open Etherscan. Copy the address and paste it on etherscan.io.|无法打开 Etherscan，请复制地址并粘贴到 etherscan.io。|Etherscan नहीं खुला। पता कॉपी करके etherscan.io पर पेस्ट करें।
RPC HTTPS et contrats Ethereum 0x… valides requis (50 maximum).|A valid HTTPS RPC and Ethereum 0x… contracts are required (maximum 50).|需要有效的 HTTPS RPC 与 Ethereum 0x… 合约，最多 50 个。|मान्य HTTPS RPC और Ethereum 0x… अनुबंध चाहिए (अधिकतम 50)।
Arrêt demandé. Si une confirmation reste affichée, refusez-la sur le Ledger.|Stop requested. Reject any pending confirmation on Ledger.|已请求停止，如 Ledger 仍显示待确认提示，请拒绝。|रोकने का अनुरोध हुआ। Ledger पर लंबित पुष्टि अस्वीकार करें।
Import impossible. Utilisez un export JSON de cette application ou un fichier TXT contenant uniquement des adresses 0x… (40000 maximum).|Import failed. Use this app’s JSON export or a TXT file containing only 0x… addresses (maximum 40000).|导入失败。请使用本软件导出的 JSON，或仅含 0x… 地址的 TXT 文件，最多 40000 个。|आयात विफल। इस ऐप का JSON या केवल 0x… पतों वाली TXT फ़ाइल उपयोग करें (अधिकतम 40000)।
BIP39 validé · {0}|BIP39 validated · {0}|BIP39 已验证 · {0}|BIP39 सत्यापित · {0}
PBKDF2 de compatibilité · phrase non validée|Compatibility PBKDF2 · unvalidated phrase|兼容 PBKDF2 · 未验证短语|अनुकूलता PBKDF2 · वाक्यांश सत्यापित नहीं
{0} itérations|{0} iterations|{0} 次迭代|{0} पुनरावृत्तियाँ
Réponse réseau incertaine. La transaction peut avoir été diffusée. Vérifiez son hash avant tout nouvel envoi.|Network reply uncertain. The transaction may have been broadcast. Check its hash before sending again.|网络响应不确定，交易可能已广播。再次发送前请检查其哈希。|नेटवर्क उत्तर अनिश्चित है। लेनदेन प्रसारित हो सकता है। दोबारा भेजने से पहले हैश जाँचें।
Envoi réservé aux adresses lues sur le Ledger pendant cette session. Relisez le Ledger.|Sending is restricted to addresses read from Ledger in this session. Read Ledger again.|仅允许从本次会话读取的 Ledger 地址发送，请重新读取 Ledger。|केवल इस सत्र में Ledger से पढ़े पते भेज सकते हैं। Ledger फिर पढ़ें।
Solde insuffisant : des ETH sont nécessaires pour les frais.|Insufficient balance: ETH is required for fees.|余额不足：支付费用需要 ETH。|शेष अपर्याप्त: शुल्क के लिए ETH चाहिए।
Solde insuffisant.|Insufficient balance.|余额不足。|शेष अपर्याप्त है।
Pas assez d’ETH pour les frais.|Not enough ETH for fees.|ETH 不足以支付费用。|शुल्क के लिए पर्याप्त ETH नहीं।
Cette adresse a déjà une transaction en attente. Attendez sa confirmation.|This address already has a pending transaction. Wait for confirmation.|此地址已有待确认交易，请等待确认。|इस पते का एक लेनदेन लंबित है। पुष्टि की प्रतीक्षा करें।
Une transaction de cette adresse attend une confirmation. Actualisez son suivi avant un nouvel envoi.|A transaction from this address awaits confirmation. Refresh its status before sending again.|此地址的一笔交易正在等待确认。再次发送前请刷新其状态。|इस पते का लेनदेन पुष्टि की प्रतीक्षा में है। फिर भेजने से पहले स्थिति ताज़ा करें।
Les frais ont expiré. Préparez à nouveau la transaction.|Fee quote expired. Prepare the transaction again.|费用报价已过期，请重新准备交易。|शुल्क अनुमान की अवधि समाप्त। लेनदेन फिर तैयार करें।
Les frais réseau ont augmenté. Préparez à nouveau la transaction.|Network fees increased. Prepare the transaction again.|网络费用已上涨，请重新准备交易。|नेटवर्क शुल्क बढ़ा है। लेनदेन फिर तैयार करें।
Le nonce a changé. Préparez de nouveau la transaction.|The nonce changed. Prepare the transaction again.|Nonce 已改变，请重新准备交易。|नॉन्स बदल गया। लेनदेन फिर तैयार करें।
Le solde ETH a changé ou ne couvre plus les frais.|The ETH balance changed or no longer covers fees.|ETH 余额已变化或不足以支付费用。|ETH शेष बदल गया या शुल्क के लिए पर्याप्त नहीं।
Le solde ERC20 a changé.|The ERC20 balance changed.|ERC20 余额已变化。|ERC20 शेष बदल गया।
Le Ledger connecté ne correspond pas à l’adresse choisie.|The connected Ledger does not match the selected address.|已连接的 Ledger 与所选地址不匹配。|कनेक्ट किया Ledger चुने पते से मेल नहीं खाता।
Cette V2 envoie les ETH vers des adresses simples. Les appels de contrat ne sont pas pris en charge.|This V2 sends ETH to regular addresses. Contract calls are not supported.|本 V2 仅向普通地址发送 ETH，不支持合约调用。|यह V2 साधारण पतों पर ETH भेजता है। अनुबंध कॉल समर्थित नहीं हैं।
Le contrat refuse ce transfert ERC20.|The contract rejects this ERC20 transfer.|合约拒绝此 ERC20 转账。|अनुबंध यह ERC20 ट्रांसफ़र अस्वीकार करता है।
Décimales ERC20 différentes du descriptif Ledger.|ERC20 decimals do not match the Ledger descriptor.|ERC20 小数位数与 Ledger 描述信息不一致。|ERC20 दशमलव Ledger विवरण से मेल नहीं खाते।
La transaction signée diffère du récapitulatif.|The signed transaction differs from the reviewed summary.|已签名交易与确认的摘要不一致。|हस्ताक्षरित लेनदेन सारांश से अलग है।
Une opération est déjà en cours.|Another operation is already running.|已有操作正在进行。|एक अन्य कार्य पहले से चल रहा है।
RPC indisponible.|RPC unavailable.|RPC 不可用。|RPC उपलब्ध नहीं।
Requête RPC refusée ou invalide.|RPC request rejected or invalid.|RPC 请求被拒绝或无效。|RPC अनुरोध अस्वीकृत या अमान्य।
Ethereum mainnet (réseau 1) requis.|Ethereum mainnet (network 1) required.|需要 Ethereum 主网（网络 1）。|Ethereum मुख्य नेटवर्क (नेटवर्क 1) चाहिए।
Ethereum mainnet requis.|Ethereum mainnet required.|需要 Ethereum 主网。|Ethereum मुख्य नेटवर्क चाहिए।
Saisissez un montant positif, sans notation scientifique.|Enter a positive amount without scientific notation.|请输入正数金额，不使用科学计数法。|वैज्ञानिक संकेत के बिना सकारात्मक राशि दर्ज करें।
Montant invalide.|Invalid amount.|金额无效。|अमान्य राशि।
Aucun contrat à cette adresse.|No contract at this address.|此地址没有合约。|इस पते पर कोई अनुबंध नहीं।
Contrat ERC20 invalide.|Invalid ERC20 contract.|ERC20 合约无效。|अमान्य ERC20 अनुबंध।
25 ERC20 personnalisés maximum.|Maximum 25 custom ERC20 tokens.|最多添加 25 种自定义 ERC20。|अधिकतम 25 कस्टम ERC20।
Descriptif ERC20 trop long.|ERC20 descriptor too long.|ERC20 描述信息过长。|ERC20 विवरण बहुत लंबा।
Métadonnées ERC20 refusées par le Ledger.|Ledger rejected the ERC20 metadata.|Ledger 拒绝了 ERC20 元数据。|Ledger ने ERC20 मेटाडेटा अस्वीकार किया।
Préparation indisponible ou déjà utilisée.|Preparation unavailable or already used.|准备信息不可用或已使用。|तैयारी अनुपलब्ध या पहले उपयोग हो चुकी है।
Préparation expirée.|Preparation expired.|准备信息已过期。|तैयारी की अवधि समाप्त।
Lecture refusée par le Ledger.|Ledger rejected the read request.|Ledger 拒绝了读取请求。|Ledger ने पढ़ने का अनुरोध अस्वीकार किया।
Déverrouillez le Ledger sur son écran, puis ouvrez Ethereum.|Unlock Ledger on its screen, then open Ethereum.|请在 Ledger 上解锁，然后打开 Ethereum。|Ledger की स्क्रीन पर अनलॉक करें, फिर Ethereum खोलें।
Connexion annulée ou aucun Ledger USB autorisé.|Connection cancelled or no authorized USB Ledger.|连接已取消或没有已授权的 USB Ledger。|कनेक्शन रद्द या कोई USB Ledger अधिकृत नहीं।
Ledger débranché. Rebranchez-le, déverrouillez-le et ouvrez Ethereum.|Ledger disconnected. Reconnect, unlock and open Ethereum.|Ledger 已断开，请重新连接、解锁并打开 Ethereum。|Ledger डिस्कनेक्ट हुआ। फिर जोड़ें, अनलॉक करें और Ethereum खोलें।
Le Ledger ne répond pas. Refusez toute demande en attente sur son écran, puis rebranchez-le.|Ledger is not responding. Reject any pending request on its screen, then reconnect it.|Ledger 无响应，请拒绝屏幕上的待处理请求后重新连接。|Ledger उत्तर नहीं दे रहा। स्क्रीन पर लंबित अनुरोध अस्वीकार करके फिर जोड़ें।
Lecture Ledger arrêtée.|Ledger reading stopped.|已停止读取 Ledger。|Ledger पढ़ना रुका।
{0} {1} adresse(s) conservée(s) sur {2} chemins demandés ; lecture incomplète.|{0} {1} address(es) kept from {2} requested paths; incomplete read.|{0} 在请求的 {2} 个路径中已保留 {1} 个地址；读取不完整。|{0} अनुरोधित {2} पथों से {1} पते रखे गए; अधूरा पठन।
`;
for(const line of rows.trim().split('\n')){const p=line.split('|');if(p.length!==4)throw Error('Translation row: '+line);TranslationCatalog[p[0]]=p.slice(1);}
TranslationCatalog['Envois : {0}\nTx indexées : {1}\nTransferts : {2}']=['Sent: {0}\nIndexed tx: {1}\nTransfers: {2}','发送：{0}\n已索引交易：{1}\n转账：{2}','भेजे गए: {0}\nअनुक्रमित लेनदेन: {1}\nट्रांसफ़र: {2}'];
})();
/* Spanish, Portuguese, German and Russian, keyed by the English translation. */
(function(){const rows=`
Your Ledger, your accounts.|Tu Ledger, tus cuentas.|Seu Ledger, suas contas.|Ihr Ledger, Ihre Konten.|Ваш Ledger, ваши счета.
Explore balances and make transactions with your Ledger.|Consulta tus saldos y realiza transacciones con Ledger.|Consulte seus saldos e faça transações com o Ledger.|Guthaben prüfen und Transaktionen mit dem Ledger ausführen.|Проверяйте баланс и выполняйте транзакции через Ledger.
Connect your Ledger|Conectar tu Ledger|Conectar seu Ledger|Ledger verbinden|Подключить Ledger
Import addresses|Importar direcciones|Importar endereços|Adressen importieren|Импортировать адреса
Connect, unlock, open Ethereum.|Conecta, desbloquea y abre Ethereum.|Conecte, desbloqueie e abra Ethereum.|Verbinden, entsperren, Ethereum öffnen.|Подключите, разблокируйте и откройте Ethereum.
Enter the PIN on the Ledger only.|Introduce el PIN solo en Ledger.|Digite o PIN somente no Ledger.|PIN ausschließlich am Ledger eingeben.|Вводите PIN только на Ledger.
Read Ledger via USB|Leer Ledger por USB|Ler Ledger por USB|Ledger über USB auslesen|Прочитать Ledger по USB
Addresses per path|Direcciones por ruta|Endereços por caminho|Adressen je Pfad|Адресов на путь
Custom path|Ruta personalizada|Caminho personalizado|Benutzerdefinierter Pfad|Свой путь
Read a recovery phrase · read only|Leer frase de recuperación · solo lectura|Ler frase de recuperação · somente leitura|Wiederherstellungsphrase lesen · nur lesend|Прочитать фразу восстановления · только чтение
Local generation|Generación local|Geração local|Lokale Ableitung|Локальное создание
Recovery phrase / seed|Frase de recuperación / seed|Frase de recuperação / seed|Wiederherstellungsphrase / Seed|Фраза восстановления / seed
12, 15, 18, 21 or 24 words|12, 15, 18, 21 o 24 palabras|12, 15, 18, 21 ou 24 palavras|12, 15, 18, 21 oder 24 Wörter|12, 15, 18, 21 или 24 слова
Show temporarily|Mostrar temporalmente|Mostrar temporariamente|Vorübergehend anzeigen|Временно показать
Phrase language|Idioma de las palabras|Idioma das palavras|Sprache der Wörter|Язык слов
Auto-detect|Detección automática|Detecção automática|Automatisch erkennen|Определить автоматически
English|Inglés|Inglês|Englisch|Английский
French|Francés|Francês|Französisch|Французский
Spanish|Español|Espanhol|Spanisch|Испанский
Italian|Italiano|Italiano|Italienisch|Итальянский
Portuguese|Portugués|Português|Portugiesisch|Португальский
Japanese|Japonés|Japonês|Japanisch|Японский
Korean|Coreano|Coreano|Koreanisch|Корейский
Simplified Chinese|Chino simplificado|Chinês simplificado|Chinesisch (vereinfacht)|Китайский (упрощённый)
Traditional Chinese|Chino tradicional|Chinês tradicional|Chinesisch (traditionell)|Китайский (традиционный)
Czech|Checo|Tcheco|Tschechisch|Чешский
Optional BIP39 passphrase|Passphrase BIP39 opcional|Passphrase BIP39 opcional|Optionale BIP39-Passphrase|Необязательная парольная фраза BIP39
Leave empty if unused|Dejar vacío si no se usa|Deixe vazio se não usar|Leer lassen, falls unbenutzt|Оставьте пустым, если не использовали
Advanced formats and compatibility|Formatos y compatibilidad avanzados|Formatos e compatibilidade avançados|Erweiterte Formate und Kompatibilität|Расширенные форматы и совместимость
Format|Formato|Formato|Format|Формат
BIP39 with validation|BIP39 con validación|BIP39 com validação|BIP39 mit Prüfung|BIP39 с проверкой
PBKDF2 without validation|PBKDF2 sin validación|PBKDF2 sem validação|PBKDF2 ohne Prüfung|PBKDF2 без проверки
Hexadecimal BIP32 seed|Seed BIP32 hexadecimal|Seed BIP32 hexadecimal|Hexadezimaler BIP32-Seed|Шестнадцатеричный seed BIP32
Choose the original wallet format.|Elige el formato de la cartera original.|Escolha o formato da carteira original.|Format der ursprünglichen Wallet wählen.|Выберите формат исходного кошелька.
Expand unique 4-letter prefixes|Completar prefijos únicos de 4 letras|Completar prefixos únicos de 4 letras|Eindeutige Präfixe mit 4 Buchstaben ergänzen|Дополнять однозначные префиксы из 4 букв
Use last word as passphrase|Usar última palabra como passphrase|Usar última palavra como passphrase|Letztes Wort als Passphrase verwenden|Использовать последнее слово как парольную фразу
PBKDF2 iterations|Iteraciones PBKDF2|Iterações PBKDF2|PBKDF2-Iterationen|Итерации PBKDF2
Generate addresses|Generar direcciones|Gerar endereços|Adressen ableiten|Создать адреса
Ready to read your Ledger.|Listo para leer tu Ledger.|Pronto para ler seu Ledger.|Bereit zum Auslesen des Ledgers.|Готово к чтению Ledger.
Copy all|Copiar todo|Copiar tudo|Alle kopieren|Копировать всё
Export addresses|Exportar direcciones|Exportar endereços|Adressen exportieren|Экспортировать адреса
Clear all|Borrar todo|Limpar tudo|Alles löschen|Очистить всё
Check balances|Verificar saldos|Verificar saldos|Guthaben prüfen|Проверить баланс
Stop|Detener|Parar|Stoppen|Остановить
Balance check settings|Ajustes de verificación|Configurações de verificação|Einstellungen zur Guthabenprüfung|Настройки проверки баланса
Ethereum RPC server|Servidor RPC Ethereum|Servidor RPC Ethereum|Ethereum-RPC-Server|RPC-сервер Ethereum
ERC20 tokens to check|ERC20 que se verificarán|ERC20 para verificar|Zu prüfende ERC20-Token|ERC20 для проверки
Customize ERC20 tokens|Personalizar ERC20|Personalizar ERC20|ERC20 anpassen|Настроить ERC20
Extra contracts · balance checks only|Contratos adicionales · solo consulta|Contratos adicionais · somente consulta|Weitere Verträge · nur Guthabenprüfung|Дополнительные контракты · только проверка
Additional ERC20 contracts|Contratos ERC20 adicionales|Contratos ERC20 adicionais|Weitere ERC20-Verträge|Дополнительные контракты ERC20
Estimate value in dollars|Estimar el valor en dólares|Estimar o valor em dólares|Wert in Dollar schätzen|Оценить стоимость в долларах
Check transactions and transfers|Consultar transacciones y transferencias|Consultar transações e transferências|Transaktionen und Transfers prüfen|Проверять транзакции и переводы
Your accounts|Tus cuentas|Suas contas|Ihre Konten|Ваши счета
Export CSV|Exportar CSV|Exportar CSV|CSV exportieren|Экспортировать CSV
estimated value in $ · ETH + ERC20|valor estimado en $ · ETH + ERC20|valor estimado em $ · ETH + ERC20|geschätzter Wert in $ · ETH + ERC20|оценка в $ · ETH + ERC20
estimated value in $ · partial|valor estimado en $ · parcial|valor estimado em $ · parcial|geschätzter Wert in $ · unvollständig|оценка в $ · неполная
unique addresses|direcciones únicas|endereços únicos|eindeutige Adressen|уникальных адресов
ETH observed|ETH detectados|ETH encontrados|ermittelte ETH|найдено ETH
addresses with a balance|direcciones con saldo|endereços com saldo|Adressen mit Guthaben|адресов с балансом
addresses checked|direcciones verificadas|endereços verificados|geprüfte Adressen|проверено адресов
Dollar prices not checked.|Precios en dólares no consultados.|Cotações em dólares não consultadas.|Dollarpreise nicht abgefragt.|Цены в долларах не запрошены.
Start by reading your Ledger.|Empieza leyendo tu Ledger.|Comece lendo seu Ledger.|Zuerst den Ledger auslesen.|Сначала прочитайте Ledger.
Copy visible addresses|Copiar las direcciones visibles|Copiar endereços visíveis|Sichtbare Adressen kopieren|Копировать видимые адреса
Positive balances|Saldos positivos|Saldos positivos|Positive Guthaben|Положительный баланс
With transactions|Con transacciones|Com transações|Mit Transaktionen|С транзакциями
Errors / unchecked|Errores / sin verificar|Erros / não verificados|Fehler / ungeprüft|Ошибки / не проверены
Refresh block and balances|Actualizar bloque y saldos|Atualizar bloco e saldos|Block und Guthaben aktualisieren|Обновить блок и баланс
Transactions in this session|Transacciones de esta sesión|Transações desta sessão|Transaktionen dieser Sitzung|Транзакции этого сеанса
Mode / index|Modo / índice|Modo / índice|Modus / Index|Режим / индекс
Address / path|Dirección / ruta|Endereço / caminho|Adresse / Pfad|Адрес / путь
ETH / account value in $|ETH / cuenta en $|ETH / conta em $|ETH / Kontowert in $|ETH / стоимость счёта в $
Transactions|Transacciones|Transações|Transaktionen|Транзакции
Status|Estado|Estado|Status|Статус
Addresses will appear here.|Las direcciones aparecerán aquí.|Os endereços aparecerão aqui.|Hier erscheinen die Adressen.|Здесь появятся адреса.
Ledger signatures only · no built-in telemetry|Firmas solo en Ledger · sin telemetría integrada|Assinaturas somente no Ledger · sem telemetria integrada|Signaturen nur am Ledger · keine integrierte Telemetrie|Подписи только на Ledger · без встроенной телеметрии
Make a transaction|Realizar una transacción|Fazer uma transação|Transaktion ausführen|Выполнить транзакцию
LEDGER SIGNATURE · ETHEREUM MAINNET|FIRMA LEDGER · RED PRINCIPAL ETHEREUM|ASSINATURA LEDGER · REDE PRINCIPAL ETHEREUM|LEDGER-SIGNATUR · ETHEREUM MAINNET|ПОДПИСЬ LEDGER · ОСНОВНАЯ СЕТЬ ETHEREUM
Close|Cerrar|Fechar|Schließen|Закрыть
Asset to send|Activo que enviar|Ativo a enviar|Zu sendender Vermögenswert|Отправляемый актив
Path for this address|Ruta de esta dirección|Caminho deste endereço|Pfad dieser Adresse|Путь этого адреса
Recipient address|Dirección del destinatario|Endereço do destinatário|Empfängeradresse|Адрес получателя
Amount|Importe|Valor|Betrag|Сумма
Review transfer and fees|Ver resumen y comisiones|Ver resumo e taxas|Transfer und Gebühren prüfen|Проверить перевод и комиссии
Review your transfer|Revisa tu transferencia|Confira sua transferência|Transfer prüfen|Проверьте перевод
The recipient is a contract: check that it accepts this token.|El destinatario es un contrato: comprueba que acepta este token.|O destinatário é um contrato: verifique se aceita este token.|Der Empfänger ist ein Vertrag: Prüfen Sie, ob er diesen Token annimmt.|Получатель — контракт: убедитесь, что он принимает этот токен.
Check recipient, amount and fees on your Ledger before confirming.|Comprueba destinatario, importe y comisiones en Ledger antes de confirmar.|Confira destinatário, valor e taxas no Ledger antes de confirmar.|Empfänger, Betrag und Gebühren vor der Bestätigung am Ledger prüfen.|Перед подтверждением проверьте получателя, сумму и комиссии на Ledger.
Edit|Modificar|Editar|Bearbeiten|Изменить
Sign on Ledger and send|Firmar en Ledger y enviar|Assinar no Ledger e enviar|Am Ledger signieren und senden|Подписать на Ledger и отправить
View transaction on Etherscan ↗|Ver transacción en Etherscan ↗|Ver transação no Etherscan ↗|Transaktion auf Etherscan ansehen ↗|Открыть транзакцию в Etherscan ↗
View on Etherscan ↗|Ver en Etherscan ↗|Ver no Etherscan ↗|Auf Etherscan ansehen ↗|Открыть в Etherscan ↗
Refresh status|Actualizar estado|Atualizar status|Status aktualisieren|Обновить статус
Information|Información|Informações|Informationen|Информация
Interface language|Idioma de la interfaz|Idioma da interface|Sprache der Oberfläche|Язык интерфейса
Add an Ethereum contract|Añadir un contrato Ethereum|Adicionar um contrato Ethereum|Ethereum-Vertrag hinzufügen|Добавить контракт Ethereum
Add|Añadir|Adicionar|Hinzufügen|Добавить
Token|Token|Token|Token|Токен
Balance check|Consulta de saldo|Consulta de saldo|Guthabenprüfung|Проверка баланса
Transaction|Transacción|Transação|Transaktion|Транзакция
Restore default ERC20 tokens|Restablecer los ERC20 predeterminados|Restaurar os ERC20 padrão|Standard-ERC20 wiederherstellen|Восстановить ERC20 по умолчанию
Remove this token|Eliminar este token|Remover este token|Diesen Token entfernen|Удалить этот токен
Ledger descriptor unavailable|Descriptor Ledger no disponible|Descritor Ledger indisponível|Ledger-Beschreibung nicht verfügbar|Описание Ledger недоступно
Your choices are saved on this computer.|Tus preferencias se guardan en este ordenador.|Suas preferências são salvas neste computador.|Ihre Auswahl wird auf diesem Computer gespeichert.|Ваш выбор сохраняется на этом компьютере.
Adding and checking the contract…|Añadiendo y verificando el contrato…|Adicionando e verificando o contrato…|Vertrag wird hinzugefügt und geprüft…|Добавление и проверка контракта…
ERC20 added. Your choices are saved.|ERC20 añadido. Preferencias guardadas.|ERC20 adicionado. Preferências salvas.|ERC20 hinzugefügt. Auswahl gespeichert.|ERC20 добавлен. Выбор сохранён.
Choices saved.|Preferencias guardadas.|Preferências salvas.|Auswahl gespeichert.|Выбор сохранён.
Default selection restored.|Selección predeterminada restablecida.|Seleção padrão restaurada.|Standardauswahl wiederhergestellt.|Выбор по умолчанию восстановлен.
Network|Red|Rede|Netzwerk|Сеть
Ethereum mainnet · network 1|Red principal Ethereum · red 1|Rede principal Ethereum · rede 1|Ethereum Mainnet · Netzwerk 1|Основная сеть Ethereum · сеть 1
From|Desde|De|Von|Откуда
To|Para|Para|An|Кому
ERC20 contract|Contrato ERC20|Contrato ERC20|ERC20-Vertrag|Контракт ERC20
Estimated fees|Comisiones estimadas|Taxas estimadas|Geschätzte Gebühren|Оценка комиссий
Maximum fees|Comisiones máximas|Taxas máximas|Maximale Gebühren|Максимальные комиссии
Maximum ETH debit|Débito máximo en ETH|Débito máximo em ETH|Maximale ETH-Belastung|Максимальное списание ETH
Ledger path|Ruta Ledger|Caminho Ledger|Ledger-Pfad|Путь Ledger
Preparation valid until|Preparación válida hasta|Preparação válida até|Vorbereitung gültig bis|Подготовка действительна до
Custom amount|Importe libre|Valor livre|Eigener Betrag|Своя сумма
Available balance calculated when preparing|Saldo disponible calculado al preparar|Saldo disponível calculado na preparação|Verfügbares Guthaben wird bei Vorbereitung berechnet|Доступный баланс будет рассчитан при подготовке
Broadcast · awaiting confirmation|Difundida · esperando confirmación|Transmitida · aguardando confirmação|Gesendet · Bestätigung ausstehend|Отправлено · ожидание подтверждения
Broadcast uncertain · check before sending again|Difusión incierta · verifica antes de reenviar|Transmissão incerta · verifique antes de reenviar|Übertragung unklar · vor erneutem Senden prüfen|Отправка не подтверждена · проверьте перед повтором
Confirmed on Ethereum|Confirmada en Ethereum|Confirmada no Ethereum|Auf Ethereum bestätigt|Подтверждено в Ethereum
Failed on Ethereum · fees may have been charged|Falló en Ethereum · puede haber comisiones|Falhou no Ethereum · taxas podem ter sido cobradas|Auf Ethereum fehlgeschlagen · Gebühren können angefallen sein|Ошибка в Ethereum · комиссии могли быть списаны
Choose recipient and amount. Your Ledger is used at the next step.|Elige destinatario e importe. Ledger se usará en el siguiente paso.|Escolha destinatário e valor. O Ledger será usado na próxima etapa.|Empfänger und Betrag wählen. Der Ledger wird im nächsten Schritt verwendet.|Выберите получателя и сумму. Ledger понадобится на следующем шаге.
Edit the transfer, then refresh the summary.|Modifica la transferencia y actualiza el resumen.|Edite a transferência e atualize o resumo.|Transfer bearbeiten, dann Zusammenfassung aktualisieren.|Измените перевод и обновите сводку.
Updating balances, simulating transfer and estimating fees…|Actualizando saldos, simulando transferencia y estimando comisiones…|Atualizando saldos, simulando transferência e estimando taxas…|Guthaben werden aktualisiert, Transfer simuliert und Gebühren geschätzt…|Обновление балансов, симуляция перевода и расчёт комиссий…
Check the intended address and amount. Then verify them on your Ledger.|Comprueba la dirección y el importe previstos. Verifícalos después en Ledger.|Confira o endereço e o valor desejados. Depois confira no Ledger.|Gewünschte Adresse und Betrag prüfen. Anschließend am Ledger vergleichen.|Проверьте нужный адрес и сумму. Затем сравните их на Ledger.
Unlock Ledger, open Ethereum, and check recipient, amount and fees on its screen. Confirm only if everything matches.|Desbloquea Ledger, abre Ethereum y comprueba destinatario, importe y comisiones en su pantalla. Confirma solo si todo coincide.|Desbloqueie o Ledger, abra Ethereum e confira destinatário, valor e taxas na tela. Confirme somente se tudo corresponder.|Ledger entsperren, Ethereum öffnen und Empfänger, Betrag und Gebühren am Gerät prüfen. Nur bestätigen, wenn alles stimmt.|Разблокируйте Ledger, откройте Ethereum и проверьте получателя, сумму и комиссии на экране. Подтверждайте только при полном совпадении.
Signature verified. Broadcasting this transaction on Ethereum…|Firma verificada. Difundiendo la transacción en Ethereum…|Assinatura verificada. Transmitindo a transação no Ethereum…|Signatur geprüft. Transaktion wird an Ethereum übertragen…|Подпись проверена. Отправка транзакции в Ethereum…
Transaction sent. Track it in this session’s transaction history.|Transacción enviada. Puedes seguirla en el historial de esta sesión.|Transação enviada. Acompanhe no histórico desta sessão.|Transaktion gesendet. Status im Verlauf dieser Sitzung verfolgen.|Транзакция отправлена. Следите за ней в истории этого сеанса.
Signature cancelled. Nothing was broadcast.|Firma cancelada. No se ha difundido nada.|Assinatura cancelada. Nada foi transmitido.|Signatur abgebrochen. Nichts wurde gesendet.|Подпись отменена. Ничего не отправлено.
Transaction rejected on Ledger. Nothing sent.|Transacción rechazada en Ledger. Nada enviado.|Transação recusada no Ledger. Nada enviado.|Transaktion am Ledger abgelehnt. Nichts gesendet.|Транзакция отклонена на Ledger. Ничего не отправлено.
Unable to sign with Ledger.|No se puede firmar con Ledger.|Não foi possível assinar com o Ledger.|Signieren mit Ledger nicht möglich.|Не удалось подписать на Ledger.
Transfer asset list unavailable.|Lista de activos no disponible.|Lista de ativos indisponível.|Liste übertragbarer Werte nicht verfügbar.|Список активов для перевода недоступен.
Switch to day mode|Cambiar a modo día|Mudar para modo dia|Zum Tagmodus wechseln|Включить дневной режим
Switch to night mode|Cambiar a modo noche|Mudar para modo noite|Zum Nachtmodus wechseln|Включить ночной режим
Copy|Copiar|Copiar|Kopieren|Копировать
Copied!|¡Copiado!|Copiado!|Kopiert!|Скопировано!
Unchecked|Sin verificar|Não verificado|Ungeprüft|Не проверено
Checked|Verificado|Verificado|Geprüft|Проверено
Incomplete|Incompleto|Incompleto|Unvollständig|Неполно
Error|Error|Erro|Fehler|Ошибка
Not requested|No solicitado|Não solicitado|Nicht angefordert|Не запрошено
Partial estimate|Estimación parcial|Estimativa parcial|Unvollständige Schätzung|Неполная оценка
Account: $ unknown|Cuenta: $ desconocido|Conta: $ desconhecido|Konto: $ unbekannt|Счёт: стоимость в $ неизвестна
No rows match these filters.|Ninguna fila coincide con estos filtros.|Nenhuma linha corresponde aos filtros.|Keine Zeilen für diese Filter.|Нет строк для этих фильтров.
Ready for local generation.|Listo para generación local.|Pronto para geração local.|Bereit zur lokalen Ableitung.|Готово к локальному созданию.
Addresses and secret fields cleared from the interface.|Direcciones y campos secretos borrados de la interfaz.|Endereços e campos secretos limpos da interface.|Adressen und geheime Felder aus der Oberfläche gelöscht.|Адреса и секретные поля удалены из интерфейса.
Choose 1 to 10000 whole addresses per path.|Elige entre 1 y 10000 direcciones enteras por ruta.|Escolha de 1 a 10000 endereços por caminho.|Ganze Zahl von 1 bis 10000 Adressen je Pfad wählen.|Выберите целое число от 1 до 10000 адресов на путь.
Enter your phrase or seed.|Introduce tu frase o seed.|Digite sua frase ou seed.|Phrase oder Seed eingeben.|Введите фразу или seed.
Select at least one path.|Selecciona al menos una ruta.|Selecione pelo menos um caminho.|Mindestens einen Pfad wählen.|Выберите хотя бы один путь.
Generating locally…|Generando localmente…|Gerando localmente…|Lokale Ableitung läuft…|Локальное создание…
Connect Ledger via USB, unlock it on the device and open Ethereum…|Conecta Ledger por USB, desbloquéalo en el dispositivo y abre Ethereum…|Conecte o Ledger por USB, desbloqueie no dispositivo e abra Ethereum…|Ledger per USB verbinden, am Gerät entsperren und Ethereum öffnen…|Подключите Ledger по USB, разблокируйте устройство и откройте Ethereum…
Public addresses read from Ledger USB. Seed and private keys stay on the device.|Direcciones públicas leídas por USB. La seed y claves privadas permanecen en Ledger.|Endereços públicos lidos por USB. A seed e as chaves privadas ficam no Ledger.|Öffentliche Adressen per USB gelesen. Seed und private Schlüssel bleiben auf dem Gerät.|Публичные адреса прочитаны по USB. Seed и закрытые ключи остаются на устройстве.
Checking Ethereum network and block…|Verificando red Ethereum y bloque…|Verificando rede Ethereum e bloco…|Ethereum-Netzwerk und Block werden geprüft…|Проверка сети Ethereum и блока…
Generation stopped.|Generación detenida.|Geração interrompida.|Ableitung gestoppt.|Создание остановлено.
Stopping balance check…|Deteniendo verificación…|Parando verificação…|Guthabenprüfung wird gestoppt…|Остановка проверки баланса…
Export saved: public addresses and results only.|Exportación guardada: solo direcciones y resultados públicos.|Exportação salva: somente endereços e resultados públicos.|Export gespeichert: nur öffentliche Adressen und Ergebnisse.|Экспорт сохранён: только публичные адреса и результаты.
Etherscan opened in your browser for this public address.|Etherscan abierto para esta dirección pública.|Etherscan aberto para este endereço público.|Etherscan für diese öffentliche Adresse im Browser geöffnet.|Etherscan открыт в браузере для этого публичного адреса.
{0} word|{0} palabra|{0} palavra|{0} Wort|{0} слово
{0} words|{0} palabras|{0} palavras|{0} Wörter|{0} слов
Block {0}|Bloque {0}|Bloco {0}|Block {0}|Блок {0}
Account ≈ {0}|Cuenta ≈ {0}|Conta ≈ {0}|Konto ≈ {0}|Счёт ≈ {0}
{0} ERC20 tokens at zero|{0} ERC20 con saldo cero|{0} ERC20 com saldo zero|{0} ERC20-Token mit Guthaben null|{0} ERC20 с нулевым балансом
{0} unknown read(s)|{0} consulta(s) desconocida(s)|{0} leitura(s) desconhecida(s)|{0} unbekannte Abfrage(n)|{0} неизвестных результатов
Details of {0} tokens|Detalle de {0} tokens|Detalhes de {0} tokens|Details zu {0} Token|Сведения о {0} токенах
Reading Ledger: {0} / {1} paths…|Leyendo Ledger: {0} / {1} rutas…|Lendo Ledger: {0} / {1} caminhos…|Ledger wird gelesen: {0} / {1} Pfade…|Чтение Ledger: {0} / {1} путей…
Local generation: {0} addresses…|Generación local: {0} direcciones…|Geração local: {0} endereços…|Lokale Ableitung: {0} Adressen…|Локальное создание: {0} адресов…
Checking: {0} / {1} addresses.|Verificando: {0} / {1} direcciones.|Verificando: {0} / {1} endereços.|Prüfung: {0} / {1} Adressen.|Проверка: {0} / {1} адресов.
Checking {0} unique addresses at block {1}…|Verificando {0} direcciones únicas en bloque {1}…|Verificando {0} endereços únicos no bloco {1}…|Prüfung von {0} eindeutigen Adressen bei Block {1}…|Проверка {0} уникальных адресов в блоке {1}…
{0} unique addresses read from Ledger. Ready to export or check balances.|{0} direcciones únicas leídas. Listo para exportar o verificar saldos.|{0} endereços únicos lidos. Pronto para exportar ou verificar saldos.|{0} eindeutige Adressen vom Ledger gelesen. Bereit für Export oder Guthabenprüfung.|Прочитано {0} уникальных адресов Ledger. Можно экспортировать или проверить баланс.
{0} unique addresses generated, {1} associated paths. Ready to export or check.|{0} direcciones únicas generadas, {1} rutas asociadas. Listo para exportar o verificar.|{0} endereços únicos gerados, {1} caminhos associados. Pronto para exportar ou verificar.|{0} eindeutige Adressen abgeleitet, {1} zugeordnete Pfade. Bereit für Export oder Prüfung.|Создано {0} уникальных адресов, связанных путей: {1}. Можно экспортировать или проверить.
{0} public addresses imported. No secrets needed to check balances.|{0} direcciones públicas importadas. No hacen falta secretos para verificar saldos.|{0} endereços públicos importados. Nenhum segredo é necessário para verificar saldos.|{0} öffentliche Adressen importiert. Keine Geheimnisse für die Guthabenprüfung nötig.|Импортировано {0} публичных адресов. Для проверки баланса секреты не нужны.
Check complete: {0} addresses, {1} incomplete. Totals include only retrieved values.|Verificación terminada: {0} direcciones, {1} incompletas. Los totales solo incluyen valores obtenidos.|Verificação concluída: {0} endereços, {1} incompletos. Os totais incluem apenas valores obtidos.|Prüfung beendet: {0} Adressen, {1} unvollständig. Summen enthalten nur ermittelte Werte.|Проверка завершена: {0} адресов, {1} неполных. Итоги содержат только полученные значения.
Observed balance: {0} {1} · balance and fees refresh before signing.|Saldo observado: {0} {1} · saldo y comisiones se actualizarán antes de firmar.|Saldo observado: {0} {1} · saldo e taxas serão atualizados antes de assinar.|Ermitteltes Guthaben: {0} {1} · Guthaben und Gebühren werden vor Signatur aktualisiert.|Обнаруженный баланс: {0} {1} · баланс и комиссии обновятся перед подписью.
{0} · unknown|{0} · desconocido|{0} · desconhecido|{0} · unbekannt|{0} · неизвестно
Indicative DefiLlama prices checked on {0} · {1} priced assets.|Precios indicativos DefiLlama consultados el {0} · {1} activos valorados.|Cotações indicativas DefiLlama consultadas em {0} · {1} ativos cotados.|Unverbindliche DefiLlama-Preise vom {0} · {1} bewertete Werte.|Справочные цены DefiLlama проверены {0} · активов с ценой: {1}.
`;
const extra={};for(const line of rows.trim().split('\n')){const p=line.split('|');if(p.length!==5)throw Error('Extra translation: '+line);extra[p[0]]=p.slice(1);}for(const values of Object.values(TranslationCatalog)){const next=extra[values[0]];values.push(...(next||Array(4).fill(values[0])));}globalThis.TranslationMissing=Object.keys(TranslationCatalog).filter(key=>!extra[TranslationCatalog[key][0]]);
})();
(function(){const rows=`
Your Ledger|Tu Ledger|Seu Ledger|Ihr Ledger|Ваш Ledger
Reading recovery phrases|Leer frases de recuperación|Ler frases de recuperação|Wiederherstellungsphrasen lesen|Чтение фраз восстановления
Derivation paths|Rutas de derivación|Caminhos de derivação|Ableitungspfade|Пути деривации
Advanced compatibility|Compatibilidad avanzada|Compatibilidade avançada|Erweiterte Kompatibilität|Расширенная совместимость
Privacy|Privacidad|Privacidade|Datenschutz|Конфиденциальность
Balance check scope|Alcance de la consulta|Escopo da consulta|Umfang der Guthabenprüfung|Область проверки баланса
Reading the results|Entender los resultados|Entender os resultados|Ergebnisse verstehen|Как читать результаты
Refresh the block|Actualizar el bloque|Atualizar o bloco|Block aktualisieren|Обновить блок
Gas and fees|Gas y comisiones|Gas e taxas|Gas und Gebühren|Газ и комиссии
Recipient|Destinatario|Destinatário|Empfänger|Получатель
Your ERC20 tokens|Tus ERC20|Seus ERC20|Ihre ERC20-Token|Ваши ERC20
Ledger information|Información sobre Ledger|Informações sobre Ledger|Ledger-Informationen|Информация о Ledger
Path information|Información sobre rutas|Informações sobre caminhos|Informationen zu Pfaden|Информация о путях
Recovery phrase information|Información sobre frases|Informações sobre frases|Informationen zu Wiederherstellungsphrasen|Информация о фразах восстановления
Format information|Información sobre formatos|Informações sobre formatos|Formatinformationen|Информация о форматах
Privacy information|Información de privacidad|Informações de privacidade|Datenschutzinformationen|Информация о конфиденциальности
Results information|Información sobre resultados|Informações sobre resultados|Informationen zu Ergebnissen|Информация о результатах
Block information|Información sobre el bloque|Informações sobre o bloco|Blockinformationen|Информация о блоке
Fee information|Información sobre comisiones|Informações sobre taxas|Gebühreninformationen|Информация о комиссиях
Recipient information|Información del destinatario|Informações do destinatário|Empfängerinformationen|Информация о получателе
ERC20 information|Información sobre ERC20|Informações sobre ERC20|ERC20-Informationen|Информация об ERC20
Connect Ledger, enter the PIN on the device and open Ethereum. Reading addresses needs no confirmation. Every transaction must be confirmed on Ledger. The recovery phrase and private keys stay on the device.|Conecta Ledger, introduce el PIN en el dispositivo y abre Ethereum. Leer direcciones no requiere confirmación. Cada transacción debe confirmarse en Ledger. La frase y las claves privadas permanecen en el dispositivo.|Conecte o Ledger, digite o PIN no dispositivo e abra Ethereum. A leitura dos endereços não exige confirmação. Cada transação precisa ser confirmada no Ledger. A frase e as chaves privadas ficam no dispositivo.|Ledger verbinden, PIN am Gerät eingeben und Ethereum öffnen. Das Auslesen benötigt keine Bestätigung. Jede Transaktion muss am Ledger bestätigt werden. Phrase und private Schlüssel bleiben auf dem Gerät.|Подключите Ledger, введите PIN на устройстве и откройте Ethereum. Чтение адресов не требует подтверждения. Каждую транзакцию нужно подтвердить на Ledger. Фраза и закрытые ключи остаются на устройстве.
This option generates addresses locally and cannot make transactions. Enter only your own phrases; use Ledger for a hardware wallet. A phrase entered on a computer is exposed to that computer.|Esta opción genera direcciones localmente y no permite transacciones. Introduce solo tus frases; usa Ledger para una cartera física. Una frase introducida en un ordenador queda expuesta a ese ordenador.|Esta opção gera endereços localmente e não faz transações. Digite somente suas frases; use Ledger para uma carteira física. Uma frase digitada no computador fica exposta a esse computador.|Diese Option leitet Adressen lokal ab und erlaubt keine Transaktionen. Nur eigene Phrasen eingeben; für Hardware-Wallets den Ledger verwenden. Eine am Computer eingegebene Phrase ist diesem Computer zugänglich.|Эта функция создаёт адреса локально и не выполняет транзакции. Вводите только свои фразы; для аппаратного кошелька используйте Ledger. Фраза, введённая на компьютере, доступна этому компьютеру.
The selected count applies to each path, from 1 to 10000. BIP44 is the standard path. Shared addresses are merged. Custom paths use {i} for the variable index; Ledger may reject some paths.|El número elegido se aplica a cada ruta, de 1 a 10000. BIP44 es la ruta estándar. Las direcciones comunes se agrupan. Las rutas personalizadas usan {i} como índice variable; Ledger puede rechazar algunas.|A quantidade escolhida vale para cada caminho, de 1 a 10000. BIP44 é o caminho padrão. Endereços iguais são agrupados. Caminhos personalizados usam {i} como índice variável; o Ledger pode recusar alguns.|Die gewählte Anzahl gilt für jeden Pfad, von 1 bis 10000. BIP44 ist der Standardpfad. Gleiche Adressen werden zusammengeführt. Eigene Pfade verwenden {i} als variablen Index; der Ledger kann manche Pfade ablehnen.|Выбранное число применяется к каждому пути: от 1 до 10000. BIP44 — стандартный путь. Совпадающие адреса объединяются. В своём пути используйте {i} для переменного индекса; Ledger может отклонять некоторые пути.
BIP39 validates words and checksum in ten languages. Unvalidated PBKDF2 and BIP32 seeds are for known historical formats. A different passphrase or iteration count produces different addresses. No words are guessed.|BIP39 valida palabras y checksum en diez idiomas. PBKDF2 sin validar y las seeds BIP32 se reservan para formatos históricos conocidos. Otra passphrase o número de iteraciones genera otras direcciones. No se adivinan palabras.|BIP39 valida palavras e checksum em dez idiomas. PBKDF2 sem validação e seeds BIP32 são para formatos antigos conhecidos. Outra passphrase ou número de iterações gera outros endereços. Nenhuma palavra é adivinhada.|BIP39 prüft Wörter und Prüfsumme in zehn Sprachen. Ungeprüftes PBKDF2 und BIP32-Seeds sind für bekannte ältere Formate gedacht. Andere Passphrasen oder Iterationszahlen erzeugen andere Adressen. Wörter werden nicht erraten.|BIP39 проверяет слова и контрольную сумму на десяти языках. PBKDF2 без проверки и seed BIP32 предназначены для известных старых форматов. Другая парольная фраза или число итераций создаёт другие адреса. Слова не угадываются.
Phrases are processed locally. RPC and history providers receive queried addresses and your outgoing IP. Signed transactions are public. No telemetry service is built in.|Las frases se procesan localmente. Los proveedores RPC e historial reciben las direcciones consultadas y tu IP de salida. Las transacciones firmadas son públicas. No hay telemetría integrada.|As frases são processadas localmente. Provedores RPC e de histórico recebem endereços consultados e seu IP de saída. Transações assinadas são públicas. Não há telemetria integrada.|Phrasen werden lokal verarbeitet. RPC- und Verlaufsanbieter erhalten abgefragte Adressen und Ihre ausgehende IP. Signierte Transaktionen sind öffentlich. Keine integrierte Telemetrie.|Фразы обрабатываются локально. RPC и сервис истории получают запрашиваемые адреса и ваш внешний IP. Подписанные транзакции публичны. Встроенной телеметрии нет.
Ethereum only: ETH and selected ERC20 tokens. NFTs, other networks and DeFi positions are not inventoried. Dollar prices are indicative. An error remains an unknown balance.|Solo Ethereum: ETH y los ERC20 seleccionados. No se incluyen NFT, otras redes ni posiciones DeFi. Los precios en dólares son indicativos. Un error significa saldo desconocido.|Somente Ethereum: ETH e ERC20 selecionados. NFT, outras redes e posições DeFi não são listados. Cotações em dólares são indicativas. Um erro significa saldo desconhecido.|Nur Ethereum: ETH und ausgewählte ERC20-Token. NFTs, andere Netzwerke und DeFi-Positionen werden nicht erfasst. Dollarpreise sind unverbindlich. Ein Fehler bedeutet unbekanntes Guthaben.|Только Ethereum: ETH и выбранные ERC20. NFT, другие сети и позиции DeFi не учитываются. Долларовые цены справочные. Ошибка означает неизвестный баланс.
0 means a checked zero balance; — means unknown or unchecked. The transaction filter includes indexed sends, receipts and transfers. Blockies icons are computed locally. Totals may be partial.|0 indica saldo nulo verificado; — significa desconocido o sin verificar. El filtro incluye envíos, recepciones y transferencias indexados. Los iconos Blockies se calculan localmente. Los totales pueden ser parciales.|0 indica saldo zero verificado; — significa desconhecido ou não verificado. O filtro inclui envios, recebimentos e transferências indexados. Blockies são calculados localmente. Totais podem ser parciais.|0 bedeutet geprüftes Guthaben null; — bedeutet unbekannt oder ungeprüft. Der Transaktionsfilter umfasst indexierte Sendungen, Eingänge und Transfers. Blockies werden lokal berechnet. Summen können unvollständig sein.|0 — проверенный нулевой баланс; — означает неизвестно или не проверено. Фильтр учитывает индексированные отправления, поступления и переводы. Значки Blockies создаются локально. Итоги могут быть неполными.
The ↻ button reruns the check at the latest available block. Balances use that same block, so the displayed number matches the results. This does not change an already prepared transaction.|El botón ↻ repite la consulta en el último bloque disponible. Los saldos corresponden a ese mismo bloque. No modifica una transacción ya preparada.|O botão ↻ refaz a consulta no último bloco disponível. Os saldos correspondem ao mesmo bloco. Isso não altera uma transação já preparada.|↻ startet die Prüfung beim neuesten verfügbaren Block erneut. Alle Guthaben beziehen sich auf diesen Block. Bereits vorbereitete Transaktionen werden dadurch nicht geändert.|Кнопка ↻ повторяет проверку на последнем доступном блоке. Балансы относятся к тому же блоку. Уже подготовленная транзакция не изменяется.
The RPC estimates gas. V2 adds a 20% margin except for a simple 21,000-unit ETH transfer. The price cap is twice the base fee plus the tip. Only gas actually used is charged. Max reserves the fee cap; some ETH may remain.|El RPC estima el gas. V2 añade un 20 % de margen, salvo transferencias ETH simples de 21 000 unidades. El precio máximo es dos veces la tarifa base más la propina. Solo se cobra el gas consumido. Max reserva el máximo de comisiones; puede quedar ETH.|O RPC estima o gas. V2 acrescenta 20% de margem, exceto no envio ETH simples de 21.000 unidades. O preço máximo é duas vezes a taxa base mais a gorjeta. Cobra-se somente o gas usado. Max reserva o limite das taxas; pode sobrar ETH.|Der RPC schätzt das Gas. V2 ergänzt 20 % Reserve, außer bei einfachen ETH-Transfers mit 21.000 Einheiten. Die Preisobergrenze ist die doppelte Basisgebühr plus Trinkgeld. Nur verbrauchtes Gas wird berechnet. Max reserviert die Gebührenobergrenze; ETH kann übrig bleiben.|RPC оценивает газ. V2 добавляет 20 % запаса, кроме простого перевода ETH с 21 000 единицами. Максимальная цена — двойная базовая комиссия плюс чаевые. Оплачивается только потраченный газ. Max резервирует верхний предел комиссий; может остаться немного ETH.
Paste a full Ethereum address. Check it in the summary and on Ledger. ENS names are not resolved. ETH transfers to contracts are not supported in this version.|Pega una dirección Ethereum completa. Compruébala en el resumen y en Ledger. No se resuelven nombres ENS. Esta versión no envía ETH a contratos.|Cole um endereço Ethereum completo. Confira no resumo e no Ledger. Nomes ENS não são resolvidos. Esta versão não envia ETH a contratos.|Vollständige Ethereum-Adresse einfügen und in der Zusammenfassung sowie am Ledger prüfen. ENS-Namen werden nicht aufgelöst. ETH-Transfers an Verträge werden hier nicht unterstützt.|Вставьте полный адрес Ethereum. Проверьте его в сводке и на Ledger. Имена ENS не разрешаются. В этой версии нельзя отправлять ETH на контракты.
The 25 search tokens and 19 transfer ERC20 tokens stay selected by default. Add an Ethereum contract to customize the list. A token can be sent only if its signed descriptor is supported by Ledger. Your choices and language are saved locally, without phrases or wallet addresses.|Los 25 tokens de consulta y 19 ERC20 de transferencia siguen seleccionados por defecto. Añade un contrato Ethereum para personalizar la lista. Solo se envían tokens con descriptor firmado compatible con Ledger. Las preferencias e idioma se guardan localmente, sin frases ni direcciones de cuenta.|Os 25 tokens de consulta e 19 ERC20 de transferência continuam selecionados por padrão. Adicione um contrato Ethereum para personalizar. Só é possível enviar tokens com descritor assinado aceito pelo Ledger. Preferências e idioma são salvos localmente, sem frases ou endereços de conta.|Die 25 Such-Token und 19 übertragbaren ERC20 bleiben standardmäßig ausgewählt. Eigene Ethereum-Verträge können ergänzt werden. Senden ist nur mit einer vom Ledger unterstützten signierten Beschreibung möglich. Auswahl und Sprache werden lokal gespeichert, ohne Phrasen oder Kontoadressen.|По умолчанию выбраны прежние 25 токенов для проверки и 19 ERC20 для перевода. Добавьте контракт Ethereum, чтобы изменить список. Отправка возможна только при поддержке подписанного описания Ledger. Выбор и язык сохраняются локально, без фраз и адресов счетов.
Check {0}|Consultar {0}|Consultar {0}|{0} prüfen|Проверять {0}
Transfer {0}|Transferir {0}|Transferir {0}|{0} übertragen|Переводить {0}
Copy address {0}|Copiar dirección {0}|Copiar endereço {0}|Adresse {0} kopieren|Копировать адрес {0}
Open {0} on Etherscan|Abrir {0} en Etherscan|Abrir {0} no Etherscan|{0} auf Etherscan öffnen|Открыть {0} в Etherscan
1 public address copied. Paste it into Etherscan with Ctrl+V.|1 dirección pública copiada. Pégala en Etherscan con Ctrl+V.|1 endereço público copiado. Cole no Etherscan com Ctrl+V.|1 öffentliche Adresse kopiert. Mit Strg+V in Etherscan einfügen.|Скопирован 1 публичный адрес. Вставьте его в Etherscan через Ctrl+V.
{0} public addresses copied. One address per line, ready to paste into a text file.|{0} direcciones públicas copiadas. Una por línea, listas para pegar en un archivo de texto.|{0} endereços públicos copiados. Um por linha, prontos para colar em um arquivo de texto.|{0} öffentliche Adressen kopiert. Eine je Zeile zum Einfügen in eine Textdatei.|Скопировано {0} публичных адресов. По одному в строке для вставки в текстовый файл.
Copy failed. Select the address and press Ctrl+C.|La copia falló. Selecciona la dirección y pulsa Ctrl+C.|A cópia falhou. Selecione o endereço e pressione Ctrl+C.|Kopieren fehlgeschlagen. Adresse markieren und Strg+C drücken.|Не удалось скопировать. Выделите адрес и нажмите Ctrl+C.
Unable to open Etherscan. Copy the address and paste it on etherscan.io.|No se pudo abrir Etherscan. Copia la dirección y pégala en etherscan.io.|Não foi possível abrir Etherscan. Copie o endereço e cole em etherscan.io.|Etherscan lässt sich nicht öffnen. Adresse kopieren und auf etherscan.io einfügen.|Не удалось открыть Etherscan. Скопируйте адрес и вставьте на etherscan.io.
A valid HTTPS RPC and Ethereum 0x… contracts are required (maximum 50).|Se requiere un RPC HTTPS válido y contratos Ethereum 0x… (máximo 50).|É necessário RPC HTTPS válido e contratos Ethereum 0x… (máximo 50).|Gültiger HTTPS-RPC und Ethereum-Verträge 0x… erforderlich (höchstens 50).|Нужны корректный HTTPS RPC и контракты Ethereum 0x… (не более 50).
Stop requested. Reject any pending confirmation on Ledger.|Parada solicitada. Rechaza cualquier confirmación pendiente en Ledger.|Parada solicitada. Recuse qualquer confirmação pendente no Ledger.|Stopp angefordert. Offene Bestätigungen am Ledger ablehnen.|Запрошена остановка. Отклоните ожидающее подтверждение на Ledger.
Import failed. Use this app’s JSON export or a TXT file containing only 0x… addresses (maximum 40000).|La importación falló. Usa el JSON de esta aplicación o un TXT solo con direcciones 0x… (máximo 40000).|A importação falhou. Use o JSON deste aplicativo ou TXT somente com endereços 0x… (máximo 40000).|Import fehlgeschlagen. JSON-Export dieser App oder TXT mit ausschließlich 0x…-Adressen verwenden (höchstens 40000).|Импорт не удался. Используйте JSON этой программы или TXT только с адресами 0x… (не более 40000).
BIP39 validated · {0}|BIP39 validado · {0}|BIP39 validado · {0}|BIP39 geprüft · {0}|BIP39 проверен · {0}
Compatibility PBKDF2 · unvalidated phrase|PBKDF2 de compatibilidad · frase sin validar|PBKDF2 de compatibilidade · frase não validada|Kompatibilitäts-PBKDF2 · ungeprüfte Phrase|Совместимый PBKDF2 · фраза не проверена
{0} iterations|{0} iteraciones|{0} iterações|{0} Iterationen|{0} итераций
Network reply uncertain. The transaction may have been broadcast. Check its hash before sending again.|Respuesta incierta. La transacción puede haberse difundido. Comprueba su hash antes de reenviar.|Resposta incerta. A transação pode ter sido transmitida. Confira o hash antes de reenviar.|Netzwerkantwort unklar. Die Transaktion könnte gesendet worden sein. Hash vor erneutem Senden prüfen.|Ответ сети неясен. Транзакция могла быть отправлена. Проверьте хеш перед повторной отправкой.
Sending is restricted to addresses read from Ledger in this session. Read Ledger again.|Solo se envía desde direcciones leídas de Ledger en esta sesión. Vuelve a leer Ledger.|Envio restrito aos endereços lidos do Ledger nesta sessão. Leia o Ledger novamente.|Senden nur von in dieser Sitzung ausgelesenen Ledger-Adressen. Ledger erneut auslesen.|Отправка доступна только с адресов Ledger, прочитанных в этом сеансе. Прочитайте Ledger заново.
Insufficient balance: ETH is required for fees.|Saldo insuficiente: hacen falta ETH para las comisiones.|Saldo insuficiente: é necessário ETH para as taxas.|Guthaben unzureichend: ETH für Gebühren erforderlich.|Недостаточный баланс: для комиссий нужен ETH.
Insufficient balance.|Saldo insuficiente.|Saldo insuficiente.|Guthaben unzureichend.|Недостаточный баланс.
Not enough ETH for fees.|No hay suficientes ETH para las comisiones.|ETH insuficiente para as taxas.|Nicht genügend ETH für Gebühren.|Недостаточно ETH для комиссий.
This address already has a pending transaction. Wait for confirmation.|Esta dirección ya tiene una transacción pendiente. Espera su confirmación.|Este endereço já tem uma transação pendente. Aguarde a confirmação.|Diese Adresse hat bereits eine ausstehende Transaktion. Bestätigung abwarten.|У этого адреса уже есть ожидающая транзакция. Дождитесь подтверждения.
A transaction from this address awaits confirmation. Refresh its status before sending again.|Una transacción de esta dirección espera confirmación. Actualiza su estado antes de reenviar.|Uma transação deste endereço aguarda confirmação. Atualize o status antes de reenviar.|Eine Transaktion dieser Adresse wartet auf Bestätigung. Status vor erneutem Senden aktualisieren.|Транзакция с этого адреса ожидает подтверждения. Обновите статус перед новой отправкой.
Fee quote expired. Prepare the transaction again.|La estimación de comisiones caducó. Prepara la transacción de nuevo.|A estimativa de taxas expirou. Prepare a transação novamente.|Gebührenschätzung abgelaufen. Transaktion erneut vorbereiten.|Оценка комиссий устарела. Подготовьте транзакцию заново.
Network fees increased. Prepare the transaction again.|Subieron las comisiones de red. Prepara la transacción de nuevo.|As taxas da rede aumentaram. Prepare a transação novamente.|Netzwerkgebühren gestiegen. Transaktion erneut vorbereiten.|Комиссии сети выросли. Подготовьте транзакцию заново.
The nonce changed. Prepare the transaction again.|El nonce cambió. Prepara la transacción de nuevo.|O nonce mudou. Prepare a transação novamente.|Nonce hat sich geändert. Transaktion erneut vorbereiten.|Nonce изменился. Подготовьте транзакцию заново.
The ETH balance changed or no longer covers fees.|El saldo ETH cambió o ya no cubre las comisiones.|O saldo ETH mudou ou não cobre mais as taxas.|ETH-Guthaben geändert oder nicht mehr ausreichend für Gebühren.|Баланс ETH изменился или больше не покрывает комиссии.
The ERC20 balance changed.|El saldo ERC20 cambió.|O saldo ERC20 mudou.|ERC20-Guthaben hat sich geändert.|Баланс ERC20 изменился.
The connected Ledger does not match the selected address.|El Ledger conectado no corresponde a la dirección elegida.|O Ledger conectado não corresponde ao endereço escolhido.|Der angeschlossene Ledger passt nicht zur gewählten Adresse.|Подключённый Ledger не соответствует выбранному адресу.
This V2 sends ETH to regular addresses. Contract calls are not supported.|Esta V2 envía ETH a direcciones normales. No admite llamadas a contratos.|Esta V2 envia ETH a endereços comuns. Chamadas a contratos não são suportadas.|Diese V2 sendet ETH an normale Adressen. Vertragsaufrufe werden nicht unterstützt.|Эта V2 отправляет ETH на обычные адреса. Вызовы контрактов не поддерживаются.
The contract rejects this ERC20 transfer.|El contrato rechaza esta transferencia ERC20.|O contrato recusa esta transferência ERC20.|Der Vertrag lehnt diesen ERC20-Transfer ab.|Контракт отклоняет этот перевод ERC20.
ERC20 decimals do not match the Ledger descriptor.|Los decimales ERC20 no coinciden con el descriptor Ledger.|As casas decimais ERC20 não correspondem ao descritor Ledger.|ERC20-Dezimalstellen stimmen nicht mit der Ledger-Beschreibung überein.|Разрядность ERC20 не совпадает с описанием Ledger.
The signed transaction differs from the reviewed summary.|La transacción firmada difiere del resumen revisado.|A transação assinada difere do resumo revisado.|Die signierte Transaktion weicht von der geprüften Zusammenfassung ab.|Подписанная транзакция отличается от проверенной сводки.
Another operation is already running.|Ya hay otra operación en curso.|Outra operação já está em andamento.|Ein anderer Vorgang läuft bereits.|Уже выполняется другая операция.
RPC unavailable.|RPC no disponible.|RPC indisponível.|RPC nicht verfügbar.|RPC недоступен.
RPC request rejected or invalid.|Solicitud RPC rechazada o no válida.|Solicitação RPC recusada ou inválida.|RPC-Anfrage abgelehnt oder ungültig.|Запрос RPC отклонён или некорректен.
Ethereum mainnet (network 1) required.|Se requiere red principal Ethereum (red 1).|É necessária a rede principal Ethereum (rede 1).|Ethereum Mainnet (Netzwerk 1) erforderlich.|Нужна основная сеть Ethereum (сеть 1).
Ethereum mainnet required.|Se requiere la red principal Ethereum.|É necessária a rede principal Ethereum.|Ethereum Mainnet erforderlich.|Нужна основная сеть Ethereum.
Enter a positive amount without scientific notation.|Introduce un importe positivo sin notación científica.|Digite um valor positivo sem notação científica.|Positiven Betrag ohne wissenschaftliche Schreibweise eingeben.|Введите положительную сумму без экспоненциальной записи.
Invalid amount.|Importe no válido.|Valor inválido.|Ungültiger Betrag.|Некорректная сумма.
No contract at this address.|No hay contrato en esta dirección.|Não há contrato neste endereço.|Kein Vertrag an dieser Adresse.|На этом адресе нет контракта.
Invalid ERC20 contract.|Contrato ERC20 no válido.|Contrato ERC20 inválido.|Ungültiger ERC20-Vertrag.|Некорректный контракт ERC20.
Maximum 25 custom ERC20 tokens.|Máximo 25 ERC20 personalizados.|Máximo de 25 ERC20 personalizados.|Höchstens 25 eigene ERC20-Token.|Не более 25 своих ERC20.
ERC20 descriptor too long.|Descriptor ERC20 demasiado largo.|Descritor ERC20 muito longo.|ERC20-Beschreibung zu lang.|Слишком длинное описание ERC20.
Ledger rejected the ERC20 metadata.|Ledger rechazó los metadatos ERC20.|O Ledger recusou os metadados ERC20.|Ledger hat die ERC20-Metadaten abgelehnt.|Ledger отклонил метаданные ERC20.
Preparation unavailable or already used.|Preparación no disponible o ya utilizada.|Preparação indisponível ou já utilizada.|Vorbereitung nicht verfügbar oder bereits verwendet.|Подготовка недоступна или уже использована.
Preparation expired.|Preparación caducada.|Preparação expirada.|Vorbereitung abgelaufen.|Срок подготовки истёк.
Ledger rejected the read request.|Ledger rechazó la lectura.|O Ledger recusou a leitura.|Ledger hat die Leseanfrage abgelehnt.|Ledger отклонил чтение.
Unlock Ledger on its screen, then open Ethereum.|Desbloquea Ledger en su pantalla y abre Ethereum.|Desbloqueie o Ledger na tela e abra Ethereum.|Ledger am Gerät entsperren, dann Ethereum öffnen.|Разблокируйте Ledger на устройстве и откройте Ethereum.
Connection cancelled or no authorized USB Ledger.|Conexión cancelada o ningún Ledger USB autorizado.|Conexão cancelada ou nenhum Ledger USB autorizado.|Verbindung abgebrochen oder kein autorisierter USB-Ledger.|Подключение отменено или нет разрешённого Ledger USB.
Ledger disconnected. Reconnect, unlock and open Ethereum.|Ledger desconectado. Reconecta, desbloquea y abre Ethereum.|Ledger desconectado. Reconecte, desbloqueie e abra Ethereum.|Ledger getrennt. Erneut verbinden, entsperren und Ethereum öffnen.|Ledger отключён. Подключите, разблокируйте и откройте Ethereum.
Ledger is not responding. Reject any pending request on its screen, then reconnect it.|Ledger no responde. Rechaza solicitudes pendientes en su pantalla y reconéctalo.|Ledger não responde. Recuse solicitações pendentes na tela e reconecte.|Ledger antwortet nicht. Offene Anfragen am Gerät ablehnen und neu verbinden.|Ledger не отвечает. Отклоните ожидающий запрос на экране и подключите заново.
Ledger reading stopped.|Lectura de Ledger detenida.|Leitura do Ledger interrompida.|Auslesen des Ledgers gestoppt.|Чтение Ledger остановлено.
{0} {1} address(es) kept from {2} requested paths; incomplete read.|{0} {1} dirección(es) conservada(s) de {2} rutas solicitadas; lectura incompleta.|{0} {1} endereço(s) mantido(s) de {2} caminhos solicitados; leitura incompleta.|{0} {1} Adresse(n) von {2} angeforderten Pfaden behalten; unvollständig gelesen.|{0} Сохранено {1} адресов из {2} запрошенных путей; чтение неполное.
`;
const extra={};for(const line of rows.trim().split('\n')){const p=line.split('|');if(p.length!==5)throw Error('Extra translation: '+line);extra[p[0]]=p.slice(1);}
extra['Sent: {0}\nIndexed tx: {1}\nTransfers: {2}']=['Envíos: {0}\nTx indexadas: {1}\nTransferencias: {2}','Envios: {0}\nTx indexadas: {1}\nTransferências: {2}','Gesendet: {0}\nIndexierte Tx: {1}\nTransfers: {2}','Отправлено: {0}\nИндексировано: {1}\nПереводы: {2}'];
for(const values of Object.values(TranslationCatalog))if(extra[values[0]])values.splice(3,4,...extra[values[0]]);globalThis.TranslationMissing=TranslationMissing.filter(key=>!extra[TranslationCatalog[key][0]]);
})();
/* V2.2: wallet generator, recipient ownership hints, and product tagline. */
(function(){const rows=`
Envoyer Tx|Send Tx|发送 Tx|Tx भेजें|Enviar Tx|Enviar Tx|Tx senden|Отправить Tx
Créer une nouvelle phrase · portefeuille ETH|Create a new phrase · ETH wallet|创建新短语 · ETH 钱包|नया वाक्यांश बनाएँ · ETH वॉलेट|Crear una nueva frase · cartera ETH|Criar nova frase · carteira ETH|Neue Phrase erstellen · ETH-Wallet|Создать новую фразу · кошелёк ETH
Créée sur cet ordinateur, pas dans le Ledger. Cette option reste en lecture seule.|Created on this computer, not inside Ledger. This option remains read-only.|在此电脑上创建，并非在 Ledger 内创建。此选项仍为只读。|यह कंप्यूटर पर बनता है, Ledger में नहीं। यह विकल्प केवल पढ़ने के लिए है।|Creada en este ordenador, no dentro de Ledger. Esta opción sigue siendo de solo lectura.|Criada neste computador, não no Ledger. Esta opção continua somente leitura.|Auf diesem Computer erstellt, nicht im Ledger. Diese Option bleibt nur lesend.|Создаётся на этом компьютере, а не в Ledger. Этот режим остаётся только для чтения.
Nombre de mots|Word count|单词数量|शब्दों की संख्या|Número de palabras|Número de palavras|Wortanzahl|Число слов
Langue de la nouvelle phrase|New phrase language|新短语的语言|नए वाक्यांश की भाषा|Idioma de la nueva frase|Idioma da nova frase|Sprache der neuen Phrase|Язык новой фразы
Créer une nouvelle phrase|Create a new phrase|创建新短语|नया वाक्यांश बनाएँ|Crear una nueva frase|Criar nova frase|Neue Phrase erstellen|Создать новую фразу
Notez cette phrase hors ligne. Elle ne sera pas enregistrée automatiquement.|Write down this phrase offline. It will not be saved automatically.|请离线记录此短语，软件不会自动保存。|वाक्यांश को ऑफ़लाइन लिख लें। यह अपने आप सहेजा नहीं जाएगा।|Anota esta frase sin conexión. No se guardará automáticamente.|Anote esta frase offline. Ela não será salva automaticamente.|Diese Phrase offline notieren. Sie wird nicht automatisch gespeichert.|Запишите фразу офлайн. Она не сохраняется автоматически.
Afficher la nouvelle phrase|Show the new phrase|显示新短语|नया वाक्यांश दिखाएँ|Mostrar la nueva frase|Mostrar a nova frase|Neue Phrase anzeigen|Показать новую фразу
Nouvelle phrase BIP39|New BIP39 phrase|新的 BIP39 短语|नया BIP39 वाक्यांश|Nueva frase BIP39|Nova frase BIP39|Neue BIP39-Phrase|Новая фраза BIP39
Première adresse ETH · BIP44|First ETH address · BIP44|首个 ETH 地址 · BIP44|पहला ETH पता · BIP44|Primera dirección ETH · BIP44|Primeiro endereço ETH · BIP44|Erste ETH-Adresse · BIP44|Первый адрес ETH · BIP44
Sélectionner les mots|Select the words|选中单词|शब्द चुनें|Seleccionar las palabras|Selecionar as palavras|Wörter markieren|Выделить слова
Lire les adresses de cette phrase|Read this phrase’s addresses|读取此短语的地址|इस वाक्यांश के पते पढ़ें|Leer las direcciones de esta frase|Ler os endereços desta frase|Adressen dieser Phrase auslesen|Прочитать адреса этой фразы
Effacer la nouvelle phrase|Clear the new phrase|清除新短语|नया वाक्यांश मिटाएँ|Borrar la nueva frase|Apagar a nova frase|Neue Phrase löschen|Очистить новую фразу
Création locale d’une nouvelle phrase BIP39…|Creating a new BIP39 phrase locally…|正在本地创建新的 BIP39 短语…|नया BIP39 वाक्यांश स्थानीय रूप से बनाया जा रहा है…|Creando una nueva frase BIP39 localmente…|Criando nova frase BIP39 localmente…|Neue BIP39-Phrase wird lokal erstellt…|Локальное создание новой фразы BIP39…
Nouvelle phrase créée localement. Notez-la avant de fermer ou de l’effacer.|New phrase created locally. Write it down before closing or clearing it.|新短语已在本地创建。关闭或清除前请先记录。|नया वाक्यांश स्थानीय रूप से बना। बंद करने या मिटाने से पहले लिख लें।|Nueva frase creada localmente. Anótala antes de cerrar o borrarla.|Nova frase criada localmente. Anote antes de fechar ou apagar.|Neue Phrase lokal erstellt. Vor dem Schließen oder Löschen notieren.|Новая фраза создана локально. Запишите её до закрытия или очистки.
Nouvelle phrase effacée de l’interface.|New phrase cleared from the interface.|已从界面清除新短语。|नया वाक्यांश इंटरफ़ेस से मिटाया गया।|Nueva frase borrada de la interfaz.|Nova frase apagada da interface.|Neue Phrase aus der Oberfläche gelöscht.|Новая фраза удалена из интерфейса.
Création arrêtée.|Creation stopped.|已停止创建。|निर्माण रोका गया।|Creación detenida.|Criação interrompida.|Erstellung gestoppt.|Создание остановлено.
Création impossible. Le générateur aléatoire sécurisé doit être disponible.|Unable to create. A secure random generator must be available.|无法创建。必须提供安全随机数生成器。|बनाना संभव नहीं। सुरक्षित रैंडम जनरेटर उपलब्ध होना चाहिए।|No se puede crear. Se necesita un generador aleatorio seguro.|Não é possível criar. É necessário um gerador aleatório seguro.|Erstellung nicht möglich. Ein sicherer Zufallsgenerator ist erforderlich.|Создание невозможно. Нужен безопасный генератор случайных чисел.
Informations sur la nouvelle phrase|New phrase information|新短语说明|नए वाक्यांश की जानकारी|Información de la nueva frase|Informações da nova frase|Informationen zur neuen Phrase|Информация о новой фразе
La phrase est créée localement avec l’aléa cryptographique du système et un checksum BIP39. Aucun appel réseau ni fichier automatique. Notez-la hors ligne avant de fermer. Elle est créée sur cet ordinateur, pas sur votre Ledger, et ne permet aucun envoi dans cette application.|The phrase is created locally using system cryptographic randomness and a BIP39 checksum. No network request or automatic file. Write it down offline before closing. It is created on this computer, not on Ledger, and cannot send funds in this app.|短语由本地系统加密随机数与 BIP39 校验和生成，无网络请求或自动文件保存。关闭前请离线记录。它在电脑而非 Ledger 上创建，无法在此软件中发送资金。|वाक्यांश सिस्टम की क्रिप्टोग्राफ़िक रैंडमनेस और BIP39 चेकसम से स्थानीय रूप से बनता है। नेटवर्क अनुरोध या अपने आप फ़ाइल नहीं बनती। बंद करने से पहले ऑफ़लाइन लिखें। यह कंप्यूटर पर बनता है, Ledger पर नहीं, और इस ऐप से धन नहीं भेज सकता।|La frase se crea localmente con aleatoriedad criptográfica del sistema y checksum BIP39. Sin red ni archivo automático. Anótala sin conexión antes de cerrar. Se crea en este ordenador, no en Ledger, y no permite envíos en esta aplicación.|A frase é criada localmente com aleatoriedade criptográfica do sistema e checksum BIP39. Sem rede ou arquivo automático. Anote offline antes de fechar. É criada no computador, não no Ledger, e não permite envios neste aplicativo.|Die Phrase wird lokal mit kryptografischem Systemzufall und BIP39-Prüfsumme erstellt. Keine Netzwerkanfrage oder automatische Datei. Vor dem Schließen offline notieren. Sie entsteht auf diesem Computer, nicht am Ledger, und erlaubt in dieser App keine Überweisungen.|Фраза создаётся локально с криптографической случайностью системы и контрольной суммой BIP39. Без сетевых запросов и автоматических файлов. Запишите её офлайн до закрытия. Она создаётся на компьютере, не на Ledger, и не позволяет отправлять средства из этой программы.
Saisissez une adresse ou choisissez un compte Ledger.|Enter an address or choose a Ledger account.|输入地址或选择 Ledger 账户。|पता दर्ज करें या Ledger खाता चुनें।|Introduce una dirección o elige una cuenta Ledger.|Digite um endereço ou escolha uma conta Ledger.|Adresse eingeben oder Ledger-Konto wählen.|Введите адрес или выберите счёт Ledger.
Choisir une de mes adresses Ledger|Choose one of my Ledger addresses|选择我的一个 Ledger 地址|मेरे Ledger पतों में से चुनें|Elegir una de mis direcciones Ledger|Escolher um dos meus endereços Ledger|Eine meiner Ledger-Adressen wählen|Выбрать один из моих адресов Ledger
Rechercher une adresse ou un chemin|Search an address or path|搜索地址或路径|पता या पथ खोजें|Buscar dirección o ruta|Buscar endereço ou caminho|Adresse oder Pfad suchen|Найти адрес или путь
Mes adresses Ledger|My Ledger addresses|我的 Ledger 地址|मेरे Ledger पते|Mis direcciones Ledger|Meus endereços Ledger|Meine Ledger-Adressen|Мои адреса Ledger
Utiliser cette adresse|Use this address|使用此地址|यह पता उपयोग करें|Usar esta dirección|Usar este endereço|Diese Adresse verwenden|Использовать этот адрес
Adresse Ethereum incomplète ou invalide.|Incomplete or invalid Ethereum address.|Ethereum 地址不完整或无效。|Ethereum पता अधूरा या अमान्य है।|Dirección Ethereum incompleta o no válida.|Endereço Ethereum incompleto ou inválido.|Unvollständige oder ungültige Ethereum-Adresse.|Неполный или некорректный адрес Ethereum.
Même adresse que l’émetteur · reconnue dans la lecture du Ledger.|Same address as the sender · recognized in the Ledger read.|与发送方地址相同 · 已在 Ledger 读取结果中识别。|प्रेषक का ही पता · Ledger पढ़ने में पहचाना गया।|Misma dirección que el emisor · reconocida al leer Ledger.|Mesmo endereço do remetente · reconhecido na leitura do Ledger.|Gleiche Adresse wie der Absender · beim Auslesen erkannt.|Адрес совпадает с отправителем · распознан при чтении Ledger.
Adresse reconnue dans la lecture du Ledger · revérifiée avant signature.|Address recognized in the Ledger read · checked again before signing.|地址已在 Ledger 读取结果中识别 · 签名前将再次核对。|Ledger पढ़ने में पहचाना पता · हस्ताक्षर से पहले फिर जाँचा जाएगा।|Dirección reconocida al leer Ledger · se verificará antes de firmar.|Endereço reconhecido na leitura do Ledger · verificado antes de assinar.|Beim Auslesen erkannte Ledger-Adresse · wird vor Signatur erneut geprüft.|Адрес распознан при чтении Ledger · будет повторно проверен перед подписью.
Adresse non reconnue dans la lecture du Ledger. Elle peut vous appartenir, mais n’a pas été vérifiée ici.|Address not recognized in the Ledger read. It may be yours, but has not been verified here.|此地址未在 Ledger 读取结果中识别。它可能属于您，但尚未在此处验证。|Ledger पढ़ने में यह पता नहीं पहचाना गया। यह आपका हो सकता है, पर यहाँ सत्यापित नहीं हुआ।|Dirección no reconocida al leer Ledger. Puede ser tuya, pero no se ha verificado aquí.|Endereço não reconhecido na leitura do Ledger. Pode ser seu, mas não foi verificado aqui.|Adresse beim Auslesen nicht erkannt. Sie kann Ihnen gehören, wurde hier jedoch nicht geprüft.|Адрес не распознан при чтении Ledger. Он может принадлежать вам, но здесь не проверен.
{0} adresses Ledger disponibles.|{0} Ledger addresses available.|可用的 Ledger 地址：{0} 个。|{0} Ledger पते उपलब्ध।|{0} direcciones Ledger disponibles.|{0} endereços Ledger disponíveis.|{0} Ledger-Adressen verfügbar.|Доступно адресов Ledger: {0}.
Contrôle du destinataire|Recipient verification|收款地址验证|प्राप्तकर्ता सत्यापन|Verificación del destinatario|Verificação do destinatário|Empfängerprüfung|Проверка получателя
Adresse du Ledger lu · vérification sur l’appareil avant signature.|Address from the scanned Ledger · verified on device before signing.|来自已读取 Ledger 的地址 · 签名前将在设备上验证。|पढ़े गए Ledger का पता · हस्ताक्षर से पहले डिवाइस पर सत्यापन।|Dirección del Ledger leído · se verificará en el dispositivo antes de firmar.|Endereço do Ledger lido · verificado no dispositivo antes de assinar.|Adresse des ausgelesenen Ledgers · vor Signatur am Gerät geprüft.|Адрес прочитанного Ledger · будет проверен на устройстве перед подписью.
Adresse non reconnue dans la lecture du Ledger. Vérifiez le destinataire.|Address not recognized in the Ledger read. Verify the recipient.|Ledger 读取结果中未识别此地址，请核对收款人。|Ledger पढ़ने में पता नहीं पहचाना गया। प्राप्तकर्ता जाँचें।|Dirección no reconocida al leer Ledger. Verifica el destinatario.|Endereço não reconhecido na leitura do Ledger. Confira o destinatário.|Beim Auslesen nicht erkannte Adresse. Empfänger prüfen.|Адрес не распознан при чтении Ledger. Проверьте получателя.
Le destinataire choisi ne correspond pas à cette adresse du Ledger connecté. Aucun envoi.|The chosen recipient does not match this address on the connected Ledger. Nothing sent.|所选收款人不匹配已连接 Ledger 上的此地址。未发送任何交易。|चुना प्राप्तकर्ता कनेक्ट किए Ledger के पते से मेल नहीं खाता। कुछ नहीं भेजा गया।|El destinatario no corresponde a esta dirección del Ledger conectado. Nada enviado.|O destinatário não corresponde a este endereço do Ledger conectado. Nada enviado.|Der Empfänger entspricht nicht dieser Adresse am verbundenen Ledger. Nichts gesendet.|Получатель не соответствует этому адресу подключённого Ledger. Ничего не отправлено.
Retrouvez vos tokens rapidement, et bien plus. Pour les crypto-bros de la première heure.|Find your tokens fast — and more. Built for old-school tech bros.|快速找回您的代币，还有更多。为老派科技玩家打造。|अपने टोकन जल्दी खोजें — और भी बहुत कुछ। पुराने दौर के टेक ब्रो के लिए।|Encuentra tus tokens rápido y mucho más. Para los tech bros de la vieja escuela.|Encontre seus tokens rápido e muito mais. Para os tech bros da velha escola.|Token schnell finden und mehr. Für Tech-Bros der alten Schule.|Быстро находите свои токены — и не только. Для технобро старой школы.
`;
for(const line of rows.trim().split('\n')){const p=line.split('|');if(p.length!==8)throw Error('V22 translation: '+line);TranslationCatalog[p[0]]=p.slice(1);}
})();

/* Independent recovery and creation sections. */
(function(){const rows=`
Lecture seed phrase|Read seed phrase|读取助记词|सीड वाक्यांश पढ़ें|Leer frase semilla|Ler frase-semente|Seed-Phrase lesen|Чтение сид-фразы
Création d’une nouvelle seed phrase|Create a new seed phrase|创建新助记词|नया सीड वाक्यांश बनाएँ|Crear una nueva frase semilla|Criar uma nova frase-semente|Neue Seed-Phrase erstellen|Создание новой сид-фразы
`;for(const line of rows.trim().split('\n')){const p=line.split('|');if(p.length!==8)throw Error('Section translation: '+line);TranslationCatalog[p[0]]=p.slice(1);}})();

/* V2.3: offline transaction workflow and legacy key readers. */
(function(){const rows=`
Transactions hors ligne · Ledger / seed / clé|Offline transactions · Ledger / seed / key|离线交易 · Ledger / 助记词 / 密钥|ऑफ़लाइन लेनदेन · Ledger / सीड / कुंजी|Transacciones offline · Ledger / semilla / clave|Transações offline · Ledger / seed / chave|Offline-Transaktionen · Ledger / Seed / Schlüssel|Офлайн-транзакции · Ledger / сид / ключ
Préparez avec Envoyer Tx sur le poste connecté et exportez le fichier non signé. Sur le poste hors ligne, importez-le, choisissez Ledger, seed phrase ou clé privée, puis exportez le fichier signé. Revenez sur le poste connecté pour le diffuser.|Prepare with Send Tx on the online computer and export the unsigned file. Import it offline, choose Ledger, seed phrase or private key, then export the signed file. Return to the online computer to broadcast.|在联网电脑用发送 Tx 准备并导出未签名文件。在离线电脑导入，选择 Ledger、助记词或私钥，导出已签名文件，再到联网电脑广播。|ऑनलाइन कंप्यूटर पर Send Tx से तैयारी कर unsigned फ़ाइल निर्यात करें। ऑफ़लाइन आयात करें, Ledger, सीड या निजी कुंजी चुनें और signed फ़ाइल निर्यात करें। प्रसारण ऑनलाइन कंप्यूटर पर करें।|Prepara con Enviar Tx en el equipo conectado y exporta el archivo sin firmar. Impórtalo sin conexión, elige Ledger, frase semilla o clave privada y exporta el archivo firmado. Vuelve al equipo conectado para difundirlo.|Prepare com Enviar Tx no computador conectado e exporte o arquivo não assinado. Importe offline, escolha Ledger, frase-semente ou chave privada e exporte o arquivo assinado. Volte ao computador conectado para transmitir.|Online mit Tx senden vorbereiten und die unsignierte Datei exportieren. Offline importieren, Ledger, Seed-Phrase oder privaten Schlüssel wählen und signierte Datei exportieren. Online übertragen.|Подготовьте через Отправить Tx онлайн и экспортируйте неподписанный файл. Импортируйте офлайн, выберите Ledger, сид-фразу или ключ и экспортируйте подписанный файл. Отправьте его с онлайн-компьютера.
Mode hors ligne : bloquer les appels réseau|Offline mode: block network requests|离线模式：阻止网络请求|ऑफ़लाइन मोड: नेटवर्क अनुरोध रोकें|Modo offline: bloquear solicitudes de red|Modo offline: bloquear solicitações de rede|Offline-Modus: Netzwerkanfragen sperren|Офлайн-режим: блокировать сетевые запросы
Hors ligne, le nonce, les soldes et les frais ne sont pas actualisés. Déconnectez aussi le réseau de l’ordinateur.|Nonce, balances and fees are not refreshed offline. Also disconnect the computer from the network.|离线时不更新 nonce、余额和费用。请同时断开电脑网络。|ऑफ़लाइन nonce, शेष राशि और शुल्क अपडेट नहीं होते। कंप्यूटर का नेटवर्क भी बंद करें।|Sin conexión no se actualizan nonce, saldos ni comisiones. Desconecta también la red del ordenador.|Offline, nonce, saldos e taxas não são atualizados. Desconecte também a rede do computador.|Offline werden Nonce, Guthaben und Gebühren nicht aktualisiert. Auch die Netzwerkverbindung des Computers trennen.|Офлайн nonce, баланс и комиссии не обновляются. Также отключите компьютер от сети.
Préparer une transaction non signée · connecté|Prepare an unsigned transaction · online|准备未签名交易 · 在线|unsigned लेनदेन तैयार करें · ऑनलाइन|Preparar transacción sin firmar · conectado|Preparar transação não assinada · conectado|Unsignierte Transaktion vorbereiten · online|Подготовить неподписанную транзакцию · онлайн
Adresse de départ|Sender address|发送地址|भेजने वाले का पता|Dirección de origen|Endereço de origem|Absenderadresse|Адрес отправителя
Chemin du signataire|Signer derivation path|签名者派生路径|हस्ताक्षरकर्ता का पथ|Ruta del firmante|Caminho do signatário|Ableitungspfad des Signierenden|Путь подписанта
Aucune clé nécessaire à cette étape. Seules les données publiques sont consultées pour le nonce, les soldes et les frais.|No key is needed at this step. Only public data is queried for nonce, balances and fees.|此步骤无需密钥。仅查询公开数据以获取 nonce、余额和费用。|इस चरण में कुंजी नहीं चाहिए। nonce, शेष राशि और शुल्क के लिए केवल सार्वजनिक डेटा लिया जाता है।|No se necesita ninguna clave en este paso. Solo se consultan datos públicos para nonce, saldos y comisiones.|Nenhuma chave é necessária nesta etapa. Apenas dados públicos são consultados para nonce, saldos e taxas.|In diesem Schritt ist kein Schlüssel nötig. Nur öffentliche Daten zu Nonce, Guthaben und Gebühren werden abgefragt.|На этом этапе ключ не нужен. Запрашиваются только открытые данные о nonce, балансе и комиссиях.
Préparer le fichier non signé|Prepare unsigned file|准备未签名文件|unsigned फ़ाइल तैयार करें|Preparar archivo sin firmar|Preparar arquivo não assinado|Unsignierte Datei vorbereiten|Подготовить неподписанный файл
Fichier de transaction JSON · signé ou non signé|Transaction JSON · signed or unsigned|交易 JSON · 已签名或未签名|लेनदेन JSON · signed या unsigned|JSON de transacción · firmado o sin firmar|JSON de transação · assinado ou não assinado|Transaktions-JSON · signiert oder unsigniert|JSON транзакции · подписанный или нет
Ouvrir un fichier JSON|Open JSON file|打开 JSON 文件|JSON फ़ाइल खोलें|Abrir archivo JSON|Abrir arquivo JSON|JSON-Datei öffnen|Открыть JSON-файл
Lire le récapitulatif|Read summary|读取摘要|सारांश पढ़ें|Leer resumen|Ler resumo|Zusammenfassung lesen|Показать сводку
Exporter le fichier non signé|Export unsigned file|导出未签名文件|unsigned फ़ाइल निर्यात करें|Exportar archivo sin firmar|Exportar arquivo não assinado|Unsignierte Datei exportieren|Экспортировать неподписанный файл
Signer avec|Sign with|签名方式|हस्ताक्षर करने का तरीका|Firmar con|Assinar com|Signieren mit|Подписать с помощью
Seed phrase BIP39|BIP39 seed phrase|BIP39 助记词|BIP39 सीड वाक्यांश|Frase semilla BIP39|Frase-semente BIP39|BIP39-Seed-Phrase|Сид-фраза BIP39
Clé racine BIP32 · xprv|BIP32 root key · xprv|BIP32 根密钥 · xprv|BIP32 रूट कुंजी · xprv|Clave raíz BIP32 · xprv|Chave raiz BIP32 · xprv|BIP32-Stammschlüssel · xprv|Корневой ключ BIP32 · xprv
Clé privée hexadécimale · une adresse|Hex private key · one address|十六进制私钥 · 单个地址|हेक्स निजी कुंजी · एक पता|Clave privada hexadecimal · una dirección|Chave privada hexadecimal · um endereço|Hexadezimaler privater Schlüssel · eine Adresse|Приватный ключ hex · один адрес
Signature sur cet ordinateur. Utilisez un poste hors ligne de confiance. Ne saisissez jamais la seed ou la clé de votre Ledger.|Signing takes place on this computer. Use a trusted offline computer. Never enter your Ledger seed or private key.|将在此电脑签名。请使用可信的离线电脑。切勿输入 Ledger 助记词或私钥。|हस्ताक्षर इस कंप्यूटर पर होंगे। भरोसेमंद ऑफ़लाइन कंप्यूटर इस्तेमाल करें। Ledger की सीड या कुंजी कभी दर्ज न करें।|La firma se realiza en este ordenador. Usa un equipo offline de confianza. Nunca introduzcas la semilla ni la clave de tu Ledger.|A assinatura ocorre neste computador. Use um computador offline confiável. Nunca digite a seed ou a chave do seu Ledger.|Signatur auf diesem Computer. Einen vertrauenswürdigen Offline-Rechner nutzen. Niemals Ledger-Seed oder -Schlüssel eingeben.|Подпись создаётся на этом компьютере. Используйте доверенный офлайн-компьютер. Не вводите сид или ключ Ledger.
Seed phrase ou clé privée|Seed phrase or private key|助记词或私钥|सीड वाक्यांश या निजी कुंजी|Frase semilla o clave privada|Frase-semente ou chave privada|Seed-Phrase oder privater Schlüssel|Сид-фраза или приватный ключ
J’ai vérifié le destinataire, le montant, le réseau et les frais.|I checked recipient, amount, network and fees.|我已核对收款人、金额、网络和费用。|मैंने प्राप्तकर्ता, राशि, नेटवर्क और शुल्क जाँचे हैं।|He revisado destinatario, importe, red y comisiones.|Conferi destinatário, valor, rede e taxas.|Empfänger, Betrag, Netzwerk und Gebühren geprüft.|Получатель, сумма, сеть и комиссии проверены.
Signer hors ligne · sans diffusion|Sign offline · do not broadcast|离线签名 · 不广播|ऑफ़लाइन हस्ताक्षर · प्रसारण नहीं|Firmar offline · sin difundir|Assinar offline · sem transmitir|Offline signieren · ohne Übertragung|Подписать офлайн · без отправки
Exporter le fichier signé|Export signed file|导出已签名文件|signed फ़ाइल निर्यात करें|Exportar archivo firmado|Exportar arquivo assinado|Signierte Datei exportieren|Экспортировать подписанный файл
Diffuser la transaction signée|Broadcast signed transaction|广播已签名交易|signed लेनदेन प्रसारित करें|Difundir transacción firmada|Transmitir transação assinada|Signierte Transaktion übertragen|Отправить подписанную транзакцию
Format à lire|Input format|输入格式|इनपुट प्रारूप|Formato de entrada|Formato de entrada|Eingabeformat|Формат ввода
Les clés privées restent en lecture seule. Ne saisissez jamais la clé ou la phrase de votre Ledger.|Private keys are read only in this section. Never enter your Ledger key or phrase.|此区域仅以只读方式读取私钥。切勿输入 Ledger 的密钥或助记词。|यहाँ निजी कुंजियाँ केवल पढ़ी जाती हैं। Ledger की कुंजी या सीड कभी दर्ज न करें।|Las claves privadas son de solo lectura en esta sección. Nunca introduzcas la clave ni la frase de tu Ledger.|As chaves são somente leitura nesta seção. Nunca digite a chave ou a frase do Ledger.|Private Schlüssel werden hier nur ausgelesen. Niemals Ledger-Schlüssel oder -Phrase eingeben.|В этом разделе ключи только читаются. Не вводите ключ или фразу Ledger.
Exporter pour signature hors ligne|Export for offline signing|导出用于离线签名|ऑफ़लाइन हस्ताक्षर हेतु निर्यात|Exportar para firma offline|Exportar para assinatura offline|Für Offline-Signatur exportieren|Экспорт для офлайн-подписи
Limite de gas|Gas limit|Gas 限额|गैस सीमा|Límite de gas|Limite de gas|Gas-Limit|Лимит газа
Frais maximum par gas|Max fee per gas|每 Gas 最高费用|प्रति गैस अधिकतम शुल्क|Comisión máxima por gas|Taxa máxima por gas|Maximale Gebühr pro Gas|Максимальная комиссия за газ
Pourboire maximum par gas|Max priority fee per gas|每 Gas 最高优先费|प्रति गैस अधिकतम प्राथमिकता शुल्क|Propina máxima por gas|Gorjeta máxima por gas|Maximale Prioritätsgebühr pro Gas|Максимальный приоритетный сбор за газ
Mode hors ligne actif : appels réseau bloqués.|Offline mode active: network requests blocked.|离线模式已启用：网络请求已阻止。|ऑफ़लाइन मोड चालू: नेटवर्क अनुरोध बंद।|Modo offline activo: solicitudes de red bloqueadas.|Modo offline ativo: solicitações de rede bloqueadas.|Offline-Modus aktiv: Netzwerkanfragen gesperrt.|Офлайн-режим: сетевые запросы заблокированы.
Mode connecté : diffusion possible après vérification.|Online mode: broadcast available after review.|在线模式：核对后可广播。|ऑनलाइन मोड: जाँच के बाद प्रसारण संभव।|Modo conectado: difusión tras revisión.|Modo conectado: transmissão após revisão.|Online-Modus: Übertragung nach Prüfung möglich.|Онлайн-режим: отправка после проверки.
Transaction signée hors ligne. Exportez le fichier signé ; aucune diffusion effectuée.|Transaction signed offline. Export the signed file; nothing was broadcast.|交易已离线签名。请导出签名文件；尚未广播。|लेनदेन ऑफ़लाइन signed हुआ। फ़ाइल निर्यात करें; प्रसारण नहीं हुआ।|Transacción firmada offline. Exporta el archivo firmado; no se ha difundido.|Transação assinada offline. Exporte o arquivo; nada foi transmitido.|Transaktion offline signiert. Signierte Datei exportieren; keine Übertragung erfolgt.|Транзакция подписана офлайн. Экспортируйте файл; отправки не было.
Signature locale hors ligne en cours…|Signing locally offline…|正在本地离线签名…|स्थानीय ऑफ़लाइन हस्ताक्षर जारी…|Firmando localmente offline…|Assinando localmente offline…|Lokale Offline-Signatur läuft…|Локальная офлайн-подпись…
`;
for(const line of rows.trim().split('\n')){const p=line.split('|');if(p.length!==8)throw Error('V23 translation: '+line);TranslationCatalog[p[0]]=p.slice(1);}
})();
(function(){TranslationCatalog['La phrase est créée localement avec l’aléa cryptographique du système et un checksum BIP39. Aucun appel réseau ni fichier automatique. Notez-la hors ligne avant de fermer. Elle est créée sur cet ordinateur, pas sur votre Ledger. Pour signer avec cette phrase, utilisez le volet Transactions hors ligne.']=[
'The phrase is generated locally with system cryptographic randomness and a BIP39 checksum. No network request or automatic file. Record it offline before closing. It is created on this computer, not on Ledger. To sign with it, use Offline transactions.',
'助记词由本地系统加密随机数与 BIP39 校验和生成，无网络请求或自动保存。关闭前请离线记录。它在电脑而非 Ledger 上生成。如需签名，请使用离线交易区域。',
'वाक्यांश सिस्टम की क्रिप्टोग्राफ़िक रैंडमनेस और BIP39 चेकसम से स्थानीय रूप से बनता है। नेटवर्क अनुरोध या स्वतः फ़ाइल नहीं बनती। बंद करने से पहले ऑफ़लाइन लिखें। यह Ledger पर नहीं, कंप्यूटर पर बनता है। हस्ताक्षर के लिए ऑफ़लाइन लेनदेन खोलें।',
'La frase se genera localmente con aleatoriedad criptográfica del sistema y checksum BIP39. Sin red ni archivo automático. Anótala offline antes de cerrar. Se crea en este ordenador, no en Ledger. Para firmar, usa Transacciones offline.',
'A frase é gerada localmente com aleatoriedade criptográfica do sistema e checksum BIP39. Sem rede ou arquivo automático. Anote offline antes de fechar. É criada no computador, não no Ledger. Para assinar, use Transações offline.',
'Die Phrase entsteht lokal mit kryptografischem Systemzufall und BIP39-Prüfsumme. Keine Netzwerkanfrage oder automatische Datei. Vor dem Schließen offline notieren. Sie entsteht am Computer, nicht am Ledger. Zum Signieren Offline-Transaktionen verwenden.',
'Фраза создаётся локально с криптографической случайностью системы и контрольной суммой BIP39. Без сетевых запросов и автосохранения. Запишите её офлайн до закрытия. Она создаётся на компьютере, а не на Ledger. Для подписи откройте Офлайн-транзакции.'
];})();
(function(){const rows=`
Tips · Ethereum|Tips · Ethereum|打赏 · Ethereum|टिप्स · Ethereum|Propinas · Ethereum|Gorjetas · Ethereum|Trinkgeld · Ethereum|Чаевые · Ethereum
Copier l’adresse|Copy address|复制地址|पता कॉपी करें|Copiar dirección|Copiar endereço|Adresse kopieren|Скопировать адрес
Branchez le Ledger par USB, saisissez le PIN sur l’appareil et ouvrez Ethereum. Fermez les autres applications utilisant le Ledger.|Connect Ledger via USB, enter the PIN on the device and open Ethereum. Close other apps using Ledger.|通过 USB 连接 Ledger，在设备上输入 PIN 并打开 Ethereum。关闭其他使用 Ledger 的应用。|Ledger को USB से जोड़ें, डिवाइस पर PIN दर्ज करें और Ethereum खोलें। Ledger इस्तेमाल करने वाले अन्य ऐप बंद करें।|Conecta Ledger por USB, introduce el PIN en el dispositivo y abre Ethereum. Cierra otras aplicaciones que usen Ledger.|Conecte o Ledger por USB, digite o PIN no dispositivo e abra Ethereum. Feche outros aplicativos que usem o Ledger.|Ledger per USB verbinden, PIN am Gerät eingeben und Ethereum öffnen. Andere Ledger-Apps schließen.|Подключите Ledger по USB, введите PIN на устройстве и откройте Ethereum. Закройте другие приложения Ledger.
Diagnostiquer USB et Tor|Check USB and Tor|检测 USB 和 Tor|USB और Tor जाँचें|Comprobar USB y Tor|Verificar USB e Tor|USB und Tor prüfen|Проверить USB и Tor
Configurer l’accès USB|Configure USB access|配置 USB 访问|USB पहुँच सेट करें|Configurar acceso USB|Configurar acesso USB|USB-Zugriff einrichten|Настроить доступ USB
Ledger détecté et accessible.|Ledger detected and accessible.|已检测到 Ledger 且可访问。|Ledger मिला और उपलब्ध है।|Ledger detectado y accesible.|Ledger detectado e acessível.|Ledger erkannt und zugänglich.|Ledger обнаружен и доступен.
Ledger détecté, accès USB refusé : utilisez Configurer l’accès USB.|Ledger detected, USB access denied: use Configure USB access.|已检测到 Ledger，但 USB 访问被拒绝：请配置 USB 访问。|Ledger मिला, USB पहुँच बंद है: USB पहुँच सेट करें।|Ledger detectado, USB denegado: usa Configurar acceso USB.|Ledger detectado, USB negado: use Configurar acesso USB.|Ledger erkannt, USB verweigert: USB-Zugriff einrichten.|Ledger обнаружен, USB недоступен: настройте доступ USB.
Aucun Ledger détecté. Vérifiez le câble, déverrouillez-le et ouvrez Ethereum.|No Ledger detected. Check the cable, unlock it and open Ethereum.|未检测到 Ledger。请检查线缆、解锁设备并打开 Ethereum。|Ledger नहीं मिला। केबल जाँचें, अनलॉक करें और Ethereum खोलें।|No se detecta Ledger. Revisa el cable, desbloquéalo y abre Ethereum.|Ledger não detectado. Confira o cabo, desbloqueie e abra Ethereum.|Kein Ledger erkannt. Kabel prüfen, entsperren und Ethereum öffnen.|Ledger не обнаружен. Проверьте кабель, разблокируйте и откройте Ethereum.
Proxy Tor disponible.|Tor proxy available.|Tor 代理可用。|Tor प्रॉक्सी उपलब्ध है।|Proxy Tor disponible.|Proxy Tor disponível.|Tor-Proxy verfügbar.|Прокси Tor доступен.
Mode hors ligne actif : aucun test réseau.|Offline mode active: no network test.|离线模式已启用：不进行网络测试。|ऑफ़लाइन मोड चालू: नेटवर्क जाँच नहीं।|Modo offline activo: sin prueba de red.|Modo offline ativo: sem teste de rede.|Offline-Modus aktiv: kein Netzwerktest.|Офлайн-режим: сеть не проверяется.
Suivez les instructions dans le terminal, puis rebranchez le Ledger et relancez le diagnostic.|Follow the terminal instructions, then reconnect Ledger and run the check again.|按终端指示操作，然后重新连接 Ledger 并再次检测。|टर्मिनल के निर्देशों के बाद Ledger दोबारा जोड़ें और जाँच फिर चलाएँ।|Sigue las instrucciones del terminal, reconecta Ledger y repite la comprobación.|Siga as instruções do terminal, reconecte o Ledger e repita a verificação.|Anweisungen im Terminal befolgen, Ledger erneut verbinden und Prüfung wiederholen.|Следуйте указаниям в терминале, переподключите Ledger и повторите проверку.
`;
for(const line of rows.trim().split('\n')){const p=line.split('|');if(p.length!==8)throw Error('USB translation: '+line);TranslationCatalog[p[0]]=p.slice(1);}})();
(function(t){t['Précédent']=['Previous','上一页','पिछला','Anterior','Anterior','Zurück','Назад'];t['Suivant']=['Next','下一页','अगला','Siguiente','Próximo','Weiter','Далее'];t['Certains diagnostics techniques avancés peuvent être affichés en anglais.']=['Advanced technical diagnostics may be shown in English.','部分高级技术诊断可能以英语显示。','कुछ उन्नत तकनीकी संदेश अंग्रेज़ी में दिख सकते हैं।','Algunos diagnósticos técnicos avanzados pueden mostrarse en inglés.','Alguns diagnósticos técnicos avançados podem aparecer em inglês.','Einige erweiterte technische Diagnosen können auf Englisch erscheinen.','Некоторые расширенные технические сообщения могут отображаться на английском.'];})(globalThis.TranslationCatalog);
