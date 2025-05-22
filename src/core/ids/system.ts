import { Id } from '../../id.js';

export const ENTITY_ID_PROPERTY = Id('1a1fff33-5782-4c33-93c7-c3a5f3592b60');

export const PROPERTY = Id('808a04ce-b21c-4d88-8ad1-2e240613e5ca');
export const SCHEMA_TYPE = Id('e7d737c5-3676-4c60-9fa1-6aa64a8c90ad');
export const PROPERTIES = Id('01412f83-8189-4ab1-8365-65c7fd358cc1');
export const NAME_PROPERTY = Id('a126ca53-0c8e-48d5-b888-82c734c38935');
export const DESCRIPTION_PROPERTY = Id('9b1f76ff-9711-404c-861e-59dc3fa7d037');
export const COVER_PROPERTY = Id('34f53507-2e6b-42c5-a844-43981a77cfa2');

export const TYPES_PROPERTY = Id('8f151ba4-de20-4e3c-9cb4-99ddf96f48f1');

export const TABS_PROPERTY = Id('4d9cba1c-4766-4698-81cd-3273891a018b');

export const BLOCKS = Id('beaba5cb-a677-41a8-b353-77030613fc70');

/** Value types */

export const VALUE_TYPE_PROPERTY = Id('ee26ef23-f7f1-4eb6-b742-3b0fa38c1fd8');
export const CHECKBOX = Id('7aa4792e-eacd-4186-8272-fa7fc18298ac');
export const TIME = Id('167664f6-68f8-40e1-976b-20bd16ed8d47');
export const TEXT = Id('9edb6fcc-e454-4aa5-8611-39d7f024c010');
export const URL = Id('283127c9-6142-4684-92ed-90b0ebc7f29a');
export const NUMBER = Id('9b597aae-c31c-46c8-8565-a370da0c2a65');
export const POINT = Id('df250d17-e364-413d-9779-2ddaae841e34');
export const IMAGE = Id('f3f790c4-c74e-4d23-a0a9-1e8ef84e30d9');

export const RELATION = Id('4b6d9fc1-fbfe-474c-861c-83398e1b50d9');

export const SPACE_TYPE = Id('362c1dbd-dc64-44bb-a3c4-652f38a642d7');

/**
 * Defines the relation value types for a relation. e.g., a Persons
 * attribute must only contain relations where the to entity is type
 * Person
 */
export const RELATION_VALUE_RELATIONSHIP_TYPE = Id('9eea393f-17dd-4971-a62e-a603e8bfec20');

export const IMAGE_TYPE = Id('ba4e4146-0010-499d-a0a3-caaa7f579d0e');
export const IMAGE_FILE_TYPE_PROPERTY = Id('515f346f-e0fb-40c7-8ea9-5339787eecc1');
export const IMAGE_HEIGHT_PROPERTY = Id('7f6ad043-3e21-4257-a6d4-8bdad36b1d84');
export const IMAGE_URL_PROPERTY = Id('8a743832-c094-4a62-b665-0c3cc2f9c7bc');
export const IMAGE_WIDTH_PROPERTY = Id('f7b33e08-b76d-4190-aada-cadaa9f561e1');

/** Data blocks */
// @TODO: data block instead of TABLE_BLOCK
export const DATA_BLOCK = Id('b8803a86-65de-412b-bb35-7e0c84adf473');
export const DATA_SOURCE_PROPERTY = Id('8ac1c4bf-453b-44b7-9eda-5d1b527e5ea3');
export const ALL_OF_GEO_DATA_SOURCE = Id('f9adb874-52b9-4982-8f55-aa40792751e3');
export const COLLECTION_DATA_SOURCE = Id('1295037a-5d9c-4d09-b27c-5502654b9177');
export const QUERY_DATA_SOURCE = Id('3b069b04-adbe-4728-917d-1283fd4ac27e');

export const SELECTOR_PROPERTY = Id('38ad3edb-8eda-4330-941b-e9abd0dbc9e1');

/**
 * Defines the filters applied to a data block. It applies whether
 * the data block is a COLLECTION or a QUERY.
 *
 * See the Filters spec to see the Filter format.
 */
export const FILTER = Id('14a46854-bfd1-4b18-8215-2785c2dab9f3');
export const SPACE_FILTER = Id('8f6df521-24fa-4576-887e-0442973e2f33');
export const ENTITY_FILTER = Id('d6b8aa86-2c73-41ca-bddb-63aa0732174c');

/**
 * Defines that a relation type is COLLECTION_ITEM. This is used by
 * data blocks with the COLLECTION_DATA_SOURCE to denote that a relation
 * should be consumed as a collection item in the block.
 *
 * Collections enable data blocks to render arbitrarily selected entities
 * rather than the results of a query. A collection item defines what
 * these selected entities are.
 */
export const COLLECTION_ITEM_RELATION_TYPE = Id('a99f9ce1-2ffa-4dac-8c61-f6310d46064a');

/**
 * Defines the view type for a data block, either a {@link TABLE_VIEW},
 * {@link GALLERY_VIEW} or a {@link LIST_VIEW}. Your own application
 * can define their own views with their own IDs.
 *
 * This view data lives on the relation pointing to the block. This enables
 * different consumers of the data block to define their own views.
 */
export const VIEW_PROPERTY = Id('1907fd1c-8111-4a3c-a378-b1f353425b65');

export const VIEW_TYPE = Id('20a21dc2-7371-482f-a120-7b147f1dc319');
export const TABLE_VIEW = Id('cba271ce-f7c1-4033-9047-614d174c69f1');
export const LIST_VIEW = Id('7d497dba-09c2-49b8-968f-716bcf520473');
export const BULLETED_LIST_VIEW = Id('0aaac6f7-c916-403e-af6d-2e086dc92ada');
export const GALLERY_VIEW = Id('ccb70fc9-17f0-4a54-b86e-3b4d20cc7130');

/**
 * Defines the columns to show on a data block when in {@link TABLE_VIEW}.
 */
export const SHOWN_COLUMNS = Id('4221fb36-dcab-4c68-b150-701aaba6c8e0');

/**
 * Defines the type of data source for a data block, either a
 * {@link COLLECTION_DATA_SOURCE}, an {@link ALL_OF_GEO_DATA_SOURCE} or
 * a {@link QUERY_DATA_SOURCE}
 */
export const DATA_SOURCE_TYPE_RELATION_TYPE = Id('1f69cc98-80d4-44ab-ad49-3df6a7b15ee4');

export const IMAGE_BLOCK = Id('e3817941-7409-4df1-b519-1f3f1a0721e8');
export const TEXT_BLOCK = Id('76474f2f-0089-4e77-a041-0b39fb17d0bf');

export const MARKDOWN_CONTENT = Id('e3e363d1-dd29-4ccb-8e6f-f3b76d99bc33');

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
export const RELATION_TYPE = Id('c167ef23-fb2a-4044-9ed9-45123ce7d2a9');
export const RELATION_FROM_PROPERTY = Id('c43b537b-cff7-4271-8822-717fdf2c9c01');
export const RELATION_TO_PROPERTY = Id('c1f4cb6f-ece4-4c3c-a447-ab005b756972');
export const RELATION_TYPE_PROPERTY = Id('14611456-b466-4cab-920d-2245f59ce828');
/*
 * Relations can be ordered using fractional indexing. By default we
 * add an index to every relation so that ordering can be added to
 * any relation at any point without having to add indexes to relations
 * post-creation.
 */
export const RELATION_INDEX = Id('ede47e69-30b0-4499-8ea4-aafbda449609');

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
export const VERIFIED_SOURCE_PROPERTY = Id('265e869b-3a27-40bd-b652-a7a77b0df24f');
export const SOURCE_SPACE_PROPERTY = Id('81891dec-cb6c-427e-aa1f-b917292ec2dc');

/** Core types */
export const ACADEMIC_FIELD_TYPE = Id('9959eb50-b029-4a15-8557-b39318cbb91b');
export const COMPANY_TYPE = Id('e059a29e-6f6b-437b-bc15-c7983d078c0d');
export const DAO_TYPE = Id('872cb6f6-926d-4bb3-9d63-ccede27232b8');
export const GOVERNMENT_ORG_TYPE = Id('a87e0291-ec36-4572-8af2-1301b3099e97');
export const INDUSTRY_TYPE = Id('fc512a40-8b55-44dc-85b8-5aae88b51fae');
export const INTEREST_TYPE = Id('2c765cae-c1b6-4cc3-a65d-693d0a67eaeb');
export const NONPROFIT_TYPE = Id('c7a192a3-3909-4572-a848-a56b64dc4636');
export const POST_TYPE = Id('f3d44614-86b7-4d25-83d8-9709c9d84f65');
export const PROJECT_TYPE = Id('484a18c5-030a-499c-b0f2-ef588ff16d50');
export const PROTOCOL_TYPE = Id('c38c4198-10c2-4cf2-9dd5-8f194033fc31');
export const REGION_TYPE = Id('c188844a-7224-42ab-b476-2991c9c913f1');
export const ROOT_SPACE_TYPE = Id('06053fcf-6443-4dc6-80ca-8a3b173a6016');

/** Templates */
export const TEMPLATE_PROPERTY = Id('cf37cd59-840c-4dac-a22b-9d9dde536ea7');
export const PAGE_TYPE = Id('480e3fc2-67f3-4993-85fb-acdf4ddeaa6b');
/**
 * Defines the page type for a template. e.g., an events page, a
 * finances page, a products page, etc.
 */
export const PAGE_TYPE_PROPERTY = Id('62dfabe5-282d-44a7-ba93-f2e80d20743d');

/**
  These define the entity id to copy when creating an entity from
  a template.
  */
export const ACADEMIC_FIELD_TEMPLATE = Id('06beeb0f-418d-46ad-84c3-82d4b1e58a81');
export const COMPANY_TEMPLATE = Id('bedb6493-dc5b-47b4-b1a5-c68bfbbb2b43');
export const DAO_TEMPLATE = Id('7ee14d70-99f0-4d0a-b371-95f08b0295be');
export const INDUSTRY_TEMPLATE = Id('d81abf98-18d9-4259-b968-e538c60c841b');
export const INTEREST_TEMPLATE = Id('59fdefec-6815-4866-9065-6d0bc162f2ee');
export const NONPROFIT_TEMPLATE = Id('838361ab-f358-4044-9f13-1586a3266a2b');
export const PERSON_TEMPLATE = Id('6bc6a6b0-b9eb-441d-b898-14f7a726877c');
export const PROTOCOL_TEMPLATE = Id('dd35d506-1787-402c-8e79-f696ab839135');
export const REGION_TEMPLATE = Id('c50754d3-bcb4-4013-a403-83f1eb9a442e');

export const ONTOLOGY_PAGE_TEMPLATE = Id('8f90bd6d-8147-4eb8-b67f-d34fa2af1397');
export const EDUCATION_PAGE_TEMPLATE = Id('c4b7e33f-939a-4871-b9e2-2711b6d3f49f');
export const ABOUT_PAGE_TEMPLATE = Id('31af0a8a-6bc1-4981-b2ac-c45f2ba4d27c');

/**
 * Defines the type of the page being copied when creating an entity
 * from a template.
 */
export const ABOUT_PAGE = Id('f93d044e-61f6-42a8-92eb-ef37a377a535');
export const ACTIVITIES_PAGE = Id('080d3c03-a770-48f2-a306-5103214aaf45');
export const CULTURE_PAGE = Id('01dbb38e-270b-4004-9615-fefb10d19f33');
export const EDUCATION_PAGE = Id('bfdc5a8f-4f6a-4955-bfbd-7bea921d8a42');
export const EVENTS_PAGE = Id('92e64c6e-36ad-453b-9533-9e4be1033cdf');
export const FINANCES_PAGE = Id('c316cec6-ddaa-436c-9c52-43b4179db529');
export const GOVERNMENT_PAGE = Id('50c29327-1dd2-425e-bd9c-c8257938c891');
export const JOBS_PAGE = Id('b4ac6985-5e8e-46d8-8f73-3ed8a918d33a');
export const NEWS_PAGE = Id('d172f6f6-93a8-4c28-9577-e9d43259863b');
export const ONTOLOGY_PAGE = Id('6e7215ec-10ca-4904-8895-2d89070a9c69');
export const PEOPLE_PAGE = Id('238bce0f-1420-4df7-85a3-088aded159fd');
export const PERSONAL_PAGE = Id('02fc9e37-25a8-487e-b219-3df738004c62');
export const PLACES_PAGE = Id('e4220e2f-6554-4321-9144-344c3be22c00');
export const POSTS_PAGE = Id('69a88b15-9a8f-4d56-930e-d7fc84accb14');
export const PRODUCTS_PAGE = Id('5f7474c7-115e-44e4-9608-af93edcaf491');
export const PROFESSIONAL_PAGE = Id('c613778e-fc19-4342-aed5-43296a72880c');
export const PROJECTS_PAGE = Id('1743389c-dafb-49a6-b667-9d8bc46f3f52');
export const SERVICES_PAGE = Id('0c06c8a0-563e-420b-b8e5-3b9c911ffa37');
export const SPACES_PAGE = Id('8afae81d-33b5-40f7-b89c-ea7d49b10f9f');
export const TEAM_PAGE = Id('55147448-8894-4ff7-a163-2f96f7afa7df');

export const FINANCE_OVERVIEW_TYPE = Id('2315fe0c-6a4d-4f99-bb19-b59c8e7c563a');
export const FINANCE_SUMMMARY_TYPE = Id('40c3c7e1-e066-43df-8eea-9900514e96ed');

/** Identity */
export const ACCOUNT_TYPE = Id('cb69723f-7456-471a-a8ad-3e93ddc3edfe');
export const ACCOUNTS_PROPERTY = Id('e4047a77-0043-4ed4-a410-72139bff7f7e');
export const ADDRESS_PROPERTY = Id('85cebdf1-d84f-4afd-993b-35f182096b59');
export const NETWORK_PROPERTY = Id('a945fa95-d15e-42bc-b70a-43d3933048dd');
export const PERSON_TYPE = Id('7ed45f2b-c48b-419e-8e46-64d5ff680b0d');
export const NETWORK_TYPE = Id('fca08431-1aa1-40f2-8a4d-0743c2a59df7');

export const GEO_LOCATION_PROPERTY = Id('7cfc4990-e068-4b77-98aa-834137d02953');
export const GOALS_PROPERTY = Id('eddd99d6-2033-4651-b046-2cecd1bd6ca5');
export const GOAL_TYPE = Id('0fecaded-7c58-4a71-9a02-e1cb49800e27');
export const MEMBERSHIP_CONTRACT_ADDRESS = Id('62f5aa2f-34ca-47c0-bcfc-a937396676dd');
export const MISSION_PROPERTY = Id('e4ed96e6-92cf-42c4-967b-ab2cef56f889');
export const PLACEHOLDER_IMAGE = Id('6c49012e-21fd-4b35-b976-60210ea0ae0f');
export const PLACEHOLDER_TEXT = Id('503e9e78-8669-4243-9777-af8fb75cdc56');
export const TAB_TYPE = Id('306a88ec-1960-4328-8cdb-77c23de2785a');
export const ROLE_PROPERTY = Id('e4e366e9-d555-4b68-92bf-7358e824afd2');

// Do we still need these?
export const DEFAULT_TYPE = Id('36ea5723-0851-4012-945e-90d05f0e54e9');
export const BROADER_CLAIMS_PROPERTY = Id('c682b9a5-82b3-4345-abc9-1c31cd09a253');
export const CLAIMS_FROM_PROPERTY = Id('8ebf2fe7-270b-4a7e-806d-e481c8c058d0');
export const DEFINITIONS_PROPERTY = Id('08abac45-2e19-4cb6-afaa-5e11a31eea99');
export const EMAIL_PROPERTY = Id('0b63fdea-d04d-4985-8f18-f97995926e6e');
export const FOREIGN_TYPES = Id('c2a3dd99-bd57-4593-a801-882e8280b94c');
export const NONPROFIT_CATEGORIES_PROPERTY = Id('29094591-c312-43c4-9c4a-0c2eb5063e2c');
export const PHONE_NUMBER_PROPERTY = Id('1840e2d2-487f-42a0-9265-f7e7a4752a75');
export const QUOTES_PROPERTY = Id('f7286c68-3412-4673-bd58-c25450ab53f9');
export const REGION_PROPERTY = Id('5b33846f-4742-49f9-86e5-7009978019a7');
export const RELATED_TOPICS_PROPERTY = Id('cc42b16e-956e-4451-a304-5f27e1c3ed11');
export const RELEVANT_QUESTIONS_PROPERTY = Id('b897ab9e-6409-473c-9071-0a34f3da537b');
export const SPEAKERS_PROPERTY = Id('4725dae3-1163-4c87-8e87-dcf159e385a6');
export const STREET_ADDRESS_PROPERTY = Id('3ed2eb81-20b1-488c-90f5-c84f58535083');
export const SUBCLAIMS_PROPERTY = Id('09cf4adf-d8e8-4b2e-8cd1-48a3d9a24ac2');
export const VALUES_PROPERTY = Id('15183b43-6f73-46b2-812d-edbe1de78343');
export const VISION_PROPERTY = Id('4a306614-0c75-416c-a347-d36b3cc9c031');

export const CURRENCY_PROPERTY = Id('9291e563-afbe-4709-8780-a52cbb0f4aa9');
export const CURRENCY_SIGN_PROPERTY = Id('d9ada086-52e3-4b66-8893-0ccf2f9fd9ea');
export const CURRENCY_SYMBOL_PROPERTY = Id('ace1e96c-9b83-47b4-bd33-1d302ec0a0f5');
export const CURRENCY_USD_PROPERTY = Id('0d4d1b02-a9e8-4982-92c4-99b1d22cd430');
export const CURRENCY_GBP_PROPERTY = Id('95593310-1e7c-43da-a02c-a6f4b630d48a');
export const CURRENCY_EUR_PROPERTY = Id('6d5a3fed-379c-4889-b60e-d6265a482c93');

export const ROOT_SPACE_ID = Id('08c4f093-7858-4b7c-9b94-b82e448abcff');
