import { Id } from '../../id.js';

export const ENTITY_ID_PROPERTY = Id('1a1fff3357824c3393c7c3a5f3592b60');

export const PROPERTY = Id('808a04ceb21c4d888ad12e240613e5ca');
export const SCHEMA_TYPE = Id('e7d737c536764c609fa16aa64a8c90ad');
export const PROPERTIES = Id('01412f8381894ab1836565c7fd358cc1');
export const NAME_PROPERTY = Id('a126ca530c8e48d5b88882c734c38935');
export const DESCRIPTION_PROPERTY = Id('9b1f76ff9711404c861e59dc3fa7d037');
export const COVER_PROPERTY = Id('34f535072e6b42c5a84443981a77cfa2');

export const TYPES_PROPERTY = Id('8f151ba4de204e3c9cb499ddf96f48f1');

export const TABS_PROPERTY = Id('4d9cba1c4766469881cd3273891a018b');

export const BLOCKS = Id('beaba5cba67741a8b35377030613fc70');

/** Data types */
export const BOOLEAN = Id('7aa4792eeacd41868272fa7fc18298ac');
export const INT64 = Id('149fd752d9d04f80820d1d942eea7841');
export const FLOAT64 = Id('9b597aaec31c46c88565a370da0c2a65');
export const DECIMAL = Id('a3288c22a0564f6fb409fbcccb2c118c');
export const TEXT = Id('9edb6fcce4544aa5861139d7f024c010');
export const BYTES = Id('66b433247667496899b48a89bd1de22b');
export const DATE = Id('e661d10292794449a22367dbae1be05a');
export const TIME = Id('ad75102b03c04d59903813ede9482742');
export const DATETIME = Id('167664f668f840e1976b20bd16ed8d47');
export const SCHEDULE = Id('caf4dd12ba4844b99171aff6c1313b50');
export const POINT = Id('df250d17e364413d97792ddaae841e34');
export const EMBEDDING = Id('f732849378ba4577a33fac5f1c964f18');
export const RELATION = Id('4b6d9fc1fbfe474c861c83398e1b50d9');

export const DATA_TYPE = Id('6d29d57849bb4959baf72cc696b1671a');

export const URL = Id('283127c96142468492ed90b0ebc7f29a');
export const IMAGE = Id('f3f790c4c74e4d23a0a91e8ef84e30d9');

export const SPACE_TYPE = Id('362c1dbddc6444bba3c4652f38a642d7');

/**
 * Defines the relation value types for a relation. e.g., a Persons
 * attribute must only contain relations where the to entity is type
 * Person
 */
export const RELATION_VALUE_RELATIONSHIP_TYPE = Id('9eea393f17dd4971a62ea603e8bfec20');

export const IMAGE_TYPE = Id('ba4e41460010499da0a3caaa7f579d0e');
export const IMAGE_FILE_TYPE_PROPERTY = Id('515f346fe0fb40c78ea95339787eecc1');
export const IMAGE_HEIGHT_PROPERTY = Id('7f6ad0433e214257a6d48bdad36b1d84');
export const IMAGE_URL_PROPERTY = Id('8a743832c0944a62b6650c3cc2f9c7bc');
export const IMAGE_WIDTH_PROPERTY = Id('f7b33e08b76d4190aadacadaa9f561e1');

export const VIDEO_TYPE = Id('d7a4817c9795405b93e212df759c43f8');
export const VIDEO_URL_PROPERTY = Id('33da2ef5bd554e91af973e082e431a13');
export const VIDEO_RENDERABLE_TYPE = Id('0fb6bbf022044db49f70fa82c41570a4');

/** Data blocks */
// @TODO: data block instead of TABLE_BLOCK
export const DATA_BLOCK = Id('b8803a8665de412bbb357e0c84adf473');
export const DATA_SOURCE_PROPERTY = Id('8ac1c4bf453b44b79eda5d1b527e5ea3');
export const ALL_OF_GEO_DATA_SOURCE = Id('f9adb87452b949828f55aa40792751e3');
export const COLLECTION_DATA_SOURCE = Id('1295037a5d9c4d09b27c5502654b9177');
export const QUERY_DATA_SOURCE = Id('3b069b04adbe4728917d1283fd4ac27e');

export const SELECTOR_PROPERTY = Id('38ad3edb8eda4330941be9abd0dbc9e1');

/**
 * Defines the filters applied to a data block. It applies whether
 * the data block is a COLLECTION or a QUERY.
 *
 * See the Filters spec to see the Filter format.
 */
export const FILTER = Id('14a46854bfd14b1882152785c2dab9f3');
export const SPACE_FILTER = Id('8f6df52124fa4576887e0442973e2f33');
export const ENTITY_FILTER = Id('d6b8aa862c7341cabddb63aa0732174c');

/**
 * Defines that a relation type is COLLECTION_ITEM. This is used by
 * data blocks with the COLLECTION_DATA_SOURCE to denote that a relation
 * should be consumed as a collection item in the block.
 *
 * Collections enable data blocks to render arbitrarily selected entities
 * rather than the results of a query. A collection item defines what
 * these selected entities are.
 */
export const COLLECTION_ITEM_RELATION_TYPE = Id('a99f9ce12ffa4dac8c61f6310d46064a');

/**
 * Defines the view type for a data block, either a {@link TABLE_VIEW},
 * {@link GALLERY_VIEW} or a {@link LIST_VIEW}. Your own application
 * can define their own views with their own IDs.
 *
 * This view data lives on the relation pointing to the block. This enables
 * different consumers of the data block to define their own views.
 */
export const VIEW_PROPERTY = Id('1907fd1c81114a3ca378b1f353425b65');

export const VIEW_TYPE = Id('20a21dc27371482fa1207b147f1dc319');
export const TABLE_VIEW = Id('cba271cef7c140339047614d174c69f1');
export const LIST_VIEW = Id('7d497dba09c249b8968f716bcf520473');
export const BULLETED_LIST_VIEW = Id('0aaac6f7c916403eaf6d2e086dc92ada');
export const GALLERY_VIEW = Id('ccb70fc917f04a54b86e3b4d20cc7130');

/**
 * Defines the columns to show on a data block when in {@link TABLE_VIEW}.
 */
export const SHOWN_COLUMNS = Id('4221fb36dcab4c68b150701aaba6c8e0');

/**
 * Defines the type of data source for a data block, either a
 * {@link COLLECTION_DATA_SOURCE}, an {@link ALL_OF_GEO_DATA_SOURCE} or
 * a {@link QUERY_DATA_SOURCE}
 */
export const DATA_SOURCE_TYPE_RELATION_TYPE = Id('1f69cc9880d444abad493df6a7b15ee4');

export const IMAGE_BLOCK = Id('e381794174094df1b5191f3f1a0721e8');
export const TEXT_BLOCK = Id('76474f2f00894e77a0410b39fb17d0bf');
export const VIDEO_BLOCK = Id('809bc406d0f34f3ca8a1aa265733c6ce');

export const MARKDOWN_CONTENT = Id('e3e363d1dd294ccb8e6ff3b76d99bc33');

/**
 * Relations define an entity which represents a relationship between
 * two entities. Modeling this relationship as a from -> to means that
 * we can add extra data about the relationship to the entity itself
 * rather than to either of the from or to entities.
 *
 * e.g., John and Jane are married and you want to add a marriage date
 * to represent when they were married. It does not make sense to add
 * the date to John and Jane directly, since the data is about the
 * marriage itself, and not John or Jane. This representation of the
 * marriage also only exists in the context of John and Jane.
 */
export const RELATION_TYPE = Id('c167ef23fb2a40449ed945123ce7d2a9');
export const RELATION_FROM_PROPERTY = Id('c43b537bcff742718822717fdf2c9c01');
export const RELATION_TO_PROPERTY = Id('c1f4cb6fece44c3ca447ab005b756972');
export const RELATION_TYPE_PROPERTY = Id('14611456b4664cab920d2245f59ce828');
/*
 * Relations can be ordered using fractional indexing. By default we
 * add an index to every relation so that ordering can be added to
 * any relation at any point without having to add indexes to relations
 * post-creation.
 */
export const RELATION_INDEX = Id('ede47e6930b044998ea4aafbda449609');

/**
 * Defines whether a relation has been "verified." Verification can
 * mean different things semantically for different spaces. This
 * flag provides a means for spaces to build UIs or tooling around
 * a semantically verified entity. It's possible for relations to
 * point to entities which aren't verified, and it's up to spaces
 * to decide what "verified" means for them.
 *
 * e.g.
 * a link to a Person might be verified in that the linked space
 * is the correct one to represent this Person from the perspective
 * of the current space.
 */
export const VERIFIED_SOURCE_PROPERTY = Id('265e869b3a2740bdb652a7a77b0df24f');
export const SOURCE_SPACE_PROPERTY = Id('81891deccb6c427eaa1fb917292ec2dc');

/** Core types */
export const ACADEMIC_FIELD_TYPE = Id('9959eb50b0294a158557b39318cbb91b');
export const COMPANY_TYPE = Id('e059a29e6f6b437bbc15c7983d078c0d');
export const DAO_TYPE = Id('872cb6f6926d4bb39d63ccede27232b8');
export const GOVERNMENT_ORG_TYPE = Id('a87e0291ec3645728af21301b3099e97');
export const INDUSTRY_TYPE = Id('fc512a408b5544dc85b85aae88b51fae');
export const INTEREST_TYPE = Id('2c765caec1b64cc3a65d693d0a67eaeb');
export const NONPROFIT_TYPE = Id('c7a192a339094572a848a56b64dc4636');
export const POST_TYPE = Id('f3d4461486b74d2583d89709c9d84f65');
export const PROJECT_TYPE = Id('484a18c5030a499cb0f2ef588ff16d50');
export const PROTOCOL_TYPE = Id('c38c419810c24cf29dd58f194033fc31');
export const REGION_TYPE = Id('c188844a722442abb4762991c9c913f1');
export const ROOT_SPACE_TYPE = Id('06053fcf64434dc680ca8a3b173a6016');

/** Templates */
export const TEMPLATE_PROPERTY = Id('cf37cd59840c4daca22b9d9dde536ea7');
export const PAGE_TYPE = Id('480e3fc267f3499385fbacdf4ddeaa6b');
/**
 * Defines the page type for a template. e.g., an events page, a
 * finances page, a products page, etc.
 */
export const PAGE_TYPE_PROPERTY = Id('62dfabe5282d44a7ba93f2e80d20743d');

/**
  These define the entity id to copy when creating an entity from
  a template.
  */
export const ACADEMIC_FIELD_TEMPLATE = Id('06beeb0f418d46ad84c382d4b1e58a81');
export const COMPANY_TEMPLATE = Id('bedb6493dc5b47b4b1a5c68bfbbb2b43');
export const DAO_TEMPLATE = Id('7ee14d7099f04d0ab37195f08b0295be');
export const INDUSTRY_TEMPLATE = Id('d81abf9818d94259b968e538c60c841b');
export const INTEREST_TEMPLATE = Id('59fdefec6815486690656d0bc162f2ee');
export const NONPROFIT_TEMPLATE = Id('838361abf35840449f131586a3266a2b');
export const PERSON_TEMPLATE = Id('6bc6a6b0b9eb441db89814f7a726877c');
export const PROTOCOL_TEMPLATE = Id('dd35d5061787402c8e79f696ab839135');
export const REGION_TEMPLATE = Id('c50754d3bcb44013a40383f1eb9a442e');

export const ONTOLOGY_PAGE_TEMPLATE = Id('8f90bd6d81474eb8b67fd34fa2af1397');
export const EDUCATION_PAGE_TEMPLATE = Id('c4b7e33f939a4871b9e22711b6d3f49f');
export const ABOUT_PAGE_TEMPLATE = Id('31af0a8a6bc14981b2acc45f2ba4d27c');

/**
 * Defines the type of the page being copied when creating an entity
 * from a template.
 */
export const ABOUT_PAGE = Id('f93d044e61f642a892ebef37a377a535');
export const ACTIVITIES_PAGE = Id('080d3c03a77048f2a3065103214aaf45');
export const CULTURE_PAGE = Id('01dbb38e270b40049615fefb10d19f33');
export const EDUCATION_PAGE = Id('bfdc5a8f4f6a4955bfbd7bea921d8a42');
export const EVENTS_PAGE = Id('92e64c6e36ad453b95339e4be1033cdf');
export const FINANCES_PAGE = Id('c316cec6ddaa436c9c5243b4179db529');
export const GOVERNMENT_PAGE = Id('50c293271dd2425ebd9cc8257938c891');
export const JOBS_PAGE = Id('b4ac69855e8e46d88f733ed8a918d33a');
export const NEWS_PAGE = Id('d172f6f693a84c289577e9d43259863b');
export const ONTOLOGY_PAGE = Id('6e7215ec10ca490488952d89070a9c69');
export const PEOPLE_PAGE = Id('238bce0f14204df785a3088aded159fd');
export const PERSONAL_PAGE = Id('02fc9e3725a8487eb2193df738004c62');
export const PLACES_PAGE = Id('e4220e2f655443219144344c3be22c00');
export const POSTS_PAGE = Id('69a88b159a8f4d56930ed7fc84accb14');
export const PRODUCTS_PAGE = Id('5f7474c7115e44e49608af93edcaf491');
export const PROFESSIONAL_PAGE = Id('c613778efc194342aed543296a72880c');
export const PROJECTS_PAGE = Id('1743389cdafb49a6b6679d8bc46f3f52');
export const SERVICES_PAGE = Id('0c06c8a0563e420bb8e53b9c911ffa37');
export const SPACES_PAGE = Id('8afae81d33b540f7b89cea7d49b10f9f');
export const TEAM_PAGE = Id('5514744888944ff7a1632f96f7afa7df');

export const FINANCE_OVERVIEW_TYPE = Id('2315fe0c6a4d4f99bb19b59c8e7c563a');
export const FINANCE_SUMMMARY_TYPE = Id('40c3c7e1e06643df8eea9900514e96ed');

/** Identity */
export const ACCOUNT_TYPE = Id('cb69723f7456471aa8ad3e93ddc3edfe');
export const ACCOUNTS_PROPERTY = Id('e4047a7700434ed4a41072139bff7f7e');
export const ADDRESS_PROPERTY = Id('85cebdf1d84f4afd993b35f182096b59');
export const NETWORK_PROPERTY = Id('a945fa95d15e42bcb70a43d3933048dd');
export const PERSON_TYPE = Id('7ed45f2bc48b419e8e4664d5ff680b0d');
export const NETWORK_TYPE = Id('fca084311aa140f28a4d0743c2a59df7');

export const GEO_LOCATION_PROPERTY = Id('7cfc4990e0684b7798aa834137d02953');
export const GOALS_PROPERTY = Id('eddd99d620334651b0462cecd1bd6ca5');
export const GOAL_TYPE = Id('0fecaded7c584a719a02e1cb49800e27');
export const MEMBERSHIP_CONTRACT_ADDRESS = Id('62f5aa2f34ca47c0bcfca937396676dd');
export const MISSION_PROPERTY = Id('e4ed96e692cf42c4967bab2cef56f889');
export const PLACEHOLDER_IMAGE = Id('6c49012e21fd4b35b97660210ea0ae0f');
export const PLACEHOLDER_TEXT = Id('503e9e78866942439777af8fb75cdc56');
export const TAB_TYPE = Id('306a88ec196043288cdb77c23de2785a');
export const ROLE_PROPERTY = Id('e4e366e9d5554b6892bf7358e824afd2');

// Do we still need these?
export const DEFAULT_TYPE = Id('36ea572308514012945e90d05f0e54e9');
export const BROADER_CLAIMS_PROPERTY = Id('c682b9a582b34345abc91c31cd09a253');
export const CLAIMS_FROM_PROPERTY = Id('8ebf2fe7270b4a7e806de481c8c058d0');
export const DEFINITIONS_PROPERTY = Id('08abac452e194cb6afaa5e11a31eea99');
export const EMAIL_PROPERTY = Id('0b63fdead04d49858f18f97995926e6e');
export const FOREIGN_TYPES = Id('c2a3dd99bd574593a801882e8280b94c');
export const NONPROFIT_CATEGORIES_PROPERTY = Id('29094591c31243c49c4a0c2eb5063e2c');
export const PHONE_NUMBER_PROPERTY = Id('1840e2d2487f42a09265f7e7a4752a75');
export const QUOTES_PROPERTY = Id('f7286c6834124673bd58c25450ab53f9');
export const REGION_PROPERTY = Id('5b33846f474249f986e57009978019a7');
export const RELATED_TOPICS_PROPERTY = Id('cc42b16e956e4451a3045f27e1c3ed11');
export const RELEVANT_QUESTIONS_PROPERTY = Id('b897ab9e6409473c90710a34f3da537b');
export const SPEAKERS_PROPERTY = Id('4725dae311634c878e87dcf159e385a6');
export const STREET_ADDRESS_PROPERTY = Id('3ed2eb8120b1488c90f5c84f58535083');
export const SUBCLAIMS_PROPERTY = Id('09cf4adfd8e84b2e8cd148a3d9a24ac2');
export const VALUES_PROPERTY = Id('15183b436f7346b2812dedbe1de78343');
export const VISION_PROPERTY = Id('4a3066140c75416ca347d36b3cc9c031');

export const CURRENCY_PROPERTY = Id('9291e563afbe47098780a52cbb0f4aa9');
export const CURRENCY_SIGN_PROPERTY = Id('d9ada08652e34b6688930ccf2f9fd9ea');
export const CURRENCY_SYMBOL_PROPERTY = Id('ace1e96c9b8347b4bd331d302ec0a0f5');
export const CURRENCY_USD_PROPERTY = Id('0d4d1b02a9e8498292c499b1d22cd430');
export const CURRENCY_GBP_PROPERTY = Id('955933101e7c43daa02ca6f4b630d48a');
export const CURRENCY_EUR_PROPERTY = Id('6d5a3fed379c4889b60ed6265a482c93');

export const ROOT_SPACE_ID = Id('08c4f09378584b7c9b94b82e448abcff');
/** Ranks */
export const RANK_TYPE = Id('5c74731dfabb4dc8b5c53346521c639a');
export const RANK_TYPE_PROPERTY = Id('48e01bc8324e48c2a6c9cab3f49290c6');
export const RANK_VOTES_RELATION_TYPE = Id('19a4cfff45f24150abf2af0f43eb2eec');
export const VOTE_ORDINAL_VALUE_PROPERTY = Id('49ee1b8918204e75a1ae38a2dcaad4a5');
export const VOTE_WEIGHTED_VALUE_PROPERTY = Id('103701ddcabe4a8e835b10345327b647');
