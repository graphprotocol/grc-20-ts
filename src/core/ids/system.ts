import { Id } from '../../id.js';

export const ENTITY_ID_PROPERTY = Id('4E7MAYWAn14fuY853CHVLs')

export const PROPERTY = Id('GscJ2GELQjmLoaVrYyR3xm');
/**
 * @deprecated use PROPERTY
 */
export const ATTRIBUTE = Id('GscJ2GELQjmLoaVrYyR3xm');
export const SCHEMA_TYPE = Id('VdTsW1mGiy1XSooJaBBLc4');
export const PROPERTIES = Id('9zBADaYzyfzyFJn4GU1cC');

export const NAME_PROPERTY = Id('LuBWqZAu6pz54eiJS5mLv8');
/*
 * @deprecated use NAME_PROPERTY
 */
export const NAME_ATTRIBUTE = Id('LuBWqZAu6pz54eiJS5mLv8');
export const DESCRIPTION_PROPERTY = Id('LA1DqP5v6QAdsgLPXGF3YA');
/*
 * @deprecated use DESCRIPTION_PROPERTY
 */
export const DESCRIPTION_ATTRIBUTE = Id('LA1DqP5v6QAdsgLPXGF3YA');
export const COVER_PROPERTY = Id('7YHk6qYkNDaAtNb8GwmysF');
/*
 * @deprecated use COVER_PROPERTY
 */
export const COVER_ATTRIBUTE = Id('7YHk6qYkNDaAtNb8GwmysF');
export const TYPES_PROPERTY = Id('Jfmby78N4BCseZinBmdVov');
/*
 * @deprecated use TYPES_PROPERTY
 */
export const TYPES_ATTRIBUTE = Id('Jfmby78N4BCseZinBmdVov');
export const TABS_PROPERTY = Id('AasCPmGHxVcsswE9PzmNT4');
/*
 * @deprecated use TABS_PROPERTY
 */
export const TABS_ATTRIBUTE = Id('AasCPmGHxVcsswE9PzmNT4');
export const BLOCKS = Id('QYbjCM6NT9xmh2hFGsqpQX');

/** Value types */

export const VALUE_TYPE_PROPERTY = Id('WQfdWjboZWFuTseDhG5Cw1');
/*
 * @deprecated use VALUE_TYPE_PROPERTY
 */
export const VALUE_TYPE_ATTRIBUTE = Id('WQfdWjboZWFuTseDhG5Cw1');
export const CHECKBOX = Id('G9NpD4c7GB7nH5YU9Tesgf');
export const TIME = Id('3mswMrL91GuYTfBq29EuNE');
export const TEXT = Id('LckSTmjBrYAJaFcDs89am5');
export const URL = Id('5xroh3gbWYbWY4oR3nFXzy');
export const NUMBER = Id('LBdMpTNyycNffsF51t2eSp');
export const POINT = Id('UZBZNbA7Uhx1f8ebLi1Qj5');
export const IMAGE = Id('X8KB1uF84RYppghBSVvhqr');

export const RELATION = Id('AKDxovGvZaPSWnmKnSoZJY');

export const SPACE_TYPE = Id('7gzF671tq5JTZ13naG4tnr');

/**
 * Defines the relation value types for a relation. e.g., a Persons
 * attribute must only contain relations where the to entity is type
 * Person
 */
export const RELATION_VALUE_RELATIONSHIP_TYPE = Id('LdAS7yWqF32E2J4doUDe5u');

export const IMAGE_TYPE = Id('Q1LaZhnzj8AtCzx8T1HRMf');
export const IMAGE_FILE_TYPE_PROPERTY = Id('B3nyKkmERhFEcaVgoe6kAL');
/*
 * @deprecated use IMAGE_FILE_TYPE_PROPERTY
 */
export const IMAGE_FILE_TYPE_ATTRIBUTE = Id('B3nyKkmERhFEcaVgoe6kAL');
export const IMAGE_HEIGHT_PROPERTY = Id('GjaFuBBB8z63y9qr8dhaSP');
/*
 * @deprecated use IMAGE_HEIGHT_PROPERTY
 */
export const IMAGE_HEIGHT_ATTRIBUTE = Id('GjaFuBBB8z63y9qr8dhaSP');
export const IMAGE_URL_PROPERTY = Id('J6cw1v8xUHCFsEdPeuB1Uo');
/*
 * @deprecated use IMAGE_URL_PROPERTY
 */
export const IMAGE_URL_ATTRIBUTE = Id('J6cw1v8xUHCFsEdPeuB1Uo');
export const IMAGE_WIDTH_PROPERTY = Id('Xb3useEUkWV1Y9zYYkq4xp');
/*
 * @deprecated use IMAGE_WIDTH_PROPERTY
 */
export const IMAGE_WIDTH_ATTRIBUTE = Id('Xb3useEUkWV1Y9zYYkq4xp');

/** Data blocks */
// @TODO: data block instead of TABLE_BLOCK
export const DATA_BLOCK = Id('PnQsGwnnztrLNRCm9mcKKY');
export const DATA_SOURCE_PROPERTY = Id('J8nmVHZDeCLNhPxX7qyEZG');
/*
 * @deprecated use DATA_SOURCE_PROPERTY
 */
export const DATA_SOURCE_ATTRIBUTE = Id('J8nmVHZDeCLNhPxX7qyEZG');
export const ALL_OF_GEO_DATA_SOURCE = Id('XqDkiYjqEufsbjqegxkqZU');
export const COLLECTION_DATA_SOURCE = Id('3J6223VX6MkwTftWdzDfo4');
export const QUERY_DATA_SOURCE = Id('8HkP7HCufp2HcCFajuJFcq');

export const SELECTOR_PROPERTY = Id('7zvaXnZVY9z5oCoYqciroz');
/*
 * @deprecated use SELECTOR_PROPERTY
 */
export const SELECTOR_ATTRIBUTE = Id('7zvaXnZVY9z5oCoYqciroz');

/**
 * Defines the filters applied to a data block. It applies whether
 * the data block is a COLLECTION or a QUERY.
 *
 * See the Filters spec to see the Filter format.
 */
export const FILTER = Id('3YqoLJ7uAPmthXyXmXKoSa');
export const SPACE_FILTER = Id('JiFmyuFYeoiRSiY286m7A2');
export const ENTITY_FILTER = Id('TWrUhTe6E8tKCJr9vfCzxT');

/**
 * Defines that a relation type is COLLECTION_ITEM. This is used by
 * data blocks with the COLLECTION_DATA_SOURCE to denote that a relation
 * should be consumed as a collection item in the block.
 *
 * Collections enable data blocks to render arbitrarily selected entities
 * rather than the results of a query. A collection item defines what
 * these selected entities are.
 */
export const COLLECTION_ITEM_RELATION_TYPE = Id('Mwrn46KavwfWgNrFaWcB9j');

/**
 * Defines the view type for a data block, either a {@link TABLE_VIEW},
 * {@link GALLERY_VIEW} or a {@link LIST_VIEW}. Your own application
 * can define their own views with their own IDs.
 *
 * This view data lives on the relation pointing to the block. This enables
 * different consumers of the data block to define their own views.
 */
export const VIEW_PROPERTY = Id('46GzPiTRPG36jX9dmNE9ic');
/*
 * @deprecated use VIEW_PROPERTY
 */
export const VIEW_ATTRIBUTE = Id('46GzPiTRPG36jX9dmNE9ic');

export const VIEW_TYPE = Id('52itq1wC2HciX6gd9HEZPN');
export const TABLE_VIEW = Id('S9T1TPras3iPkVvrS5CoKE');
export const LIST_VIEW = Id('GUKPGARFBFBMoET6NGQctJ');
export const BULLETED_LIST_VIEW = Id('2KQ8CHTruSetFbi48nsHV3');
export const GALLERY_VIEW = Id('SHBs5faKV8gDeZgsUoVUQF');

/**
 * Defines the columns to show on a data block when in {@link TABLE_VIEW}.
 */
export const SHOWN_COLUMNS = Id('9AecPe8JTN7uJRaX1Mk1XV');

/**
 * Defines the type of data source for a data block, either a
 * {@link COLLECTION_DATA_SOURCE}, an {@link ALL_OF_GEO_DATA_SOURCE} or
 * a {@link QUERY_DATA_SOURCE}
 */
export const DATA_SOURCE_TYPE_RELATION_TYPE = Id('4sz7Kx91uq4KBW5sohjLkj');

export const IMAGE_BLOCK = Id('V6R8hWrKfLZmtyv4dQyyzo');
export const TEXT_BLOCK = Id('Fc836HBAyTaLaZgBzcTS2a');

export const MARKDOWN_CONTENT = Id('V9A2298ZHL135zFRH4qcRg');

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
export const RELATION_TYPE = Id('QtC4Ay8HNLwSd1kSARgcDE');
export const RELATION_FROM_PROPERTY = Id('RERshk4JoYoMC17r1qAo9J');
/*
 * @deprecated use RELATION_FROM_PROPERTY
 */
export const RELATION_FROM_ATTRIBUTE = Id('RERshk4JoYoMC17r1qAo9J');
export const RELATION_TO_PROPERTY = Id('Qx8dASiTNsxxP3rJbd4Lzd');
/*
 * @deprecated use RELATION_TO_PROPERTY
 */
export const RELATION_TO_ATTRIBUTE = Id('Qx8dASiTNsxxP3rJbd4Lzd');
export const RELATION_TYPE_PROPERTY = Id('3WxYoAVreE4qFhkDUs5J3q');
/*
 * @deprecated use RELATION_TYPE_PROPERTY
 */
export const RELATION_TYPE_ATTRIBUTE = Id('3WxYoAVreE4qFhkDUs5J3q');
/*
 * Relations can be ordered using fractional indexing. By default we
 * add an index to every relation so that ordering can be added to
 * any relation at any point without having to add indexes to relations
 * post-creation.
 */
export const RELATION_INDEX = Id('WNopXUYxsSsE51gkJGWghe');

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
export const VERIFIED_SOURCE_PROPERTY = Id('5jodArZNFzucsYzQaDVFBL');
/*
 * @deprecated use VERIFIED_SOURCE_PROPERTY
 */
export const VERIFIED_SOURCE_ATTRIBUTE = Id('5jodArZNFzucsYzQaDVFBL');
export const SOURCE_SPACE_PROPERTY = Id('GzkEQP3yedWjXE8QPFKEwV');
/*
 * @deprecated use SOURCE_SPACE_PROPERTY
 */
export const SOURCE_SPACE_ATTRIBUTE = Id('GzkEQP3yedWjXE8QPFKEwV');

/** Core types */
export const ACADEMIC_FIELD_TYPE = Id('KwKGhkY5AmzmHHggg7abvi');
export const COMPANY_TYPE = Id('UhpHYoFEzAov9WwqtDwQk4');
export const DAO_TYPE = Id('Hh8hc47TMBvRsD4oqUNxP9');
export const GOVERNMENT_ORG_TYPE = Id('MokrHqV4jZhBfPN3mLPjM8');
export const INDUSTRY_TYPE = Id('YA7mhzaafD2vnjekmcnLER');
export const INTEREST_TYPE = Id('6VSi54UDKnL34BWHBqdzee');
export const NONPROFIT_TYPE = Id('RemzN69c24othsp2rP7yMX');
export const POST_TYPE = Id('X7KuZJQewaCiCy9QV2vjyv');
export const PROJECT_TYPE = Id('9vk7Q3pz7US3s2KePFQrJT');
export const PROTOCOL_TYPE = Id('R9Xo87Q6oaxfSBrHvVQFdS');
export const REGION_TYPE = Id('Qu6vfQq68ecZ4PkihJ4nZN');
export const ROOT_SPACE_TYPE = Id('k7vbnMPxzdtGL2J3uaB6d');

/** Templates */
export const TEMPLATE_PROPERTY = Id('Sb7ZvdGsCDm2r1mNZBA5ft');
/*
 * @deprecated use TEMPLATE_PROPERTY
 */
export const TEMPLATE_ATTRIBUTE = Id('Sb7ZvdGsCDm2r1mNZBA5ft');
export const PAGE_TYPE = Id('9u4zseS3EDXG9ZvwR9RmqU');
/**
 * Defines the page type for a template. e.g., an events page, a
 * finances page, a products page, etc.
 */
export const PAGE_TYPE_PROPERTY = Id('DD9FKRZ3XezaKEGUszMB3r');
/*
 * @deprecated use PAGE_TYPE_PROPERTY
 */
export const PAGE_TYPE_ATTRIBUTE = Id('DD9FKRZ3XezaKEGUszMB3r');

/**
  These define the entity id to copy when creating an entity from
  a template.
  */
export const ACADEMIC_FIELD_TEMPLATE = Id('qKChmTLcV1itqfQeGeYVv');
export const COMPANY_TEMPLATE = Id('QZwChwTixtbLDv3HSX5E6n');
export const DAO_TEMPLATE = Id('Gfj89RHeFexx36V5kN6LhB');
export const INDUSTRY_TEMPLATE = Id('Tgm2ubmm9VjAZFZACJLTZC');
export const INTEREST_TEMPLATE = Id('C7XkQKqhRHv28Uuo5m2DZP');
export const NONPROFIT_TEMPLATE = Id('HEuj9VYAF5z1KQ8x37Uzze');
export const PERSON_TEMPLATE = Id('EJuFuEz17wdVCk9ctEAkW7');
export const PROTOCOL_TEMPLATE = Id('UKKzBPkwY51qcVB9QTLNB6');
export const REGION_TEMPLATE = Id('RL8uWpewpYdcmJ3rjoudjT');

export const ONTOLOGY_PAGE_TEMPLATE = Id('JjEDWDpLYS7tYBKi4vCdwc');
export const EDUCATION_PAGE_TEMPLATE = Id('RHuzjGkGothjuwGN6TLXDx');
export const ABOUT_PAGE_TEMPLATE = Id('78qghJm6whF5proE9G93pX');

/**
 * Defines the type of the page being copied when creating an entity
 * from a template.
 */
export const ABOUT_PAGE = Id('Xn4sgn16Peoe64NSoARRv4');
export const ACTIVITIES_PAGE = Id('zfgeDtfzvmt9xbWVJj9DE');
export const CULTURE_PAGE = Id('EJuJfWHqXnorH4zbLgawC');
export const EDUCATION_PAGE = Id('Qh8AQ8hQhXiaAbe8HkgAJV');
export const EVENTS_PAGE = Id('K97FaTqrx54jdiM93vZ1Fc');
export const FINANCES_PAGE = Id('R6FDYEK9CCdEQuxjuRjA2U');
export const GOVERNMENT_PAGE = Id('AyQpCWpt4p58B4CFu6GYPJ');
export const JOBS_PAGE = Id('PJzxY3isAL3hGx1bRkYdPf');
export const NEWS_PAGE = Id('Ss6NVRoX8HKaEyFTEYNdUv');
export const ONTOLOGY_PAGE = Id('Ee2Es1b9PkfnR7nsbY2ubE');
export const PEOPLE_PAGE = Id('5PatoErephYf1ZJ8U6rNz8');
export const PERSONAL_PAGE = Id('NPiVay5xbawmNJu7E1FLD');
export const PLACES_PAGE = Id('VAuhjqTMdZ2UR4Hj1TekTh');
export const POSTS_PAGE = Id('E3jboNrTeuopjKgJ45ykBd');
export const PRODUCTS_PAGE = Id('Cnf53HgY8T7Fwcq8choaRn');
export const PROFESSIONAL_PAGE = Id('RTdzv7qaBfjrSKbEnvCdaT');
export const PROJECTS_PAGE = Id('3scJVFciFuhmaXe852pT3F');
export const SERVICES_PAGE = Id('2V8pajmGDJt8egodkJeoPC');
export const SPACES_PAGE = Id('JAPV1HvzUBXH1advi47FWN');
export const TEAM_PAGE = Id('BWMHGbpR31xTbjvk4QZdQA');

export const FINANCE_OVERVIEW_TYPE = Id('5LHixDnR2vBTx26kmbnyih');
export const FINANCE_SUMMMARY_TYPE = Id('8zrMWkTeDkfxbGn1U1MjLx');

/** Identity */
export const ACCOUNT_TYPE = Id('S7rX6suDMmU75yjbAD5WsP');
export const ACCOUNTS_PROPERTY = Id('VA5i7mm1v3QMjUChMT5dPs');
/*
 * @deprecated use ACCOUNTS_PROPERTY
 */
export const ACCOUNTS_ATTRIBUTE = Id('VA5i7mm1v3QMjUChMT5dPs');
export const ADDRESS_PROPERTY = Id('HXLpAZyQkcy6Di4YJu4xzU');
/*
 * @deprecated use ADDRESS_PROPERTY
 */
export const ADDRESS_ATTRIBUTE = Id('HXLpAZyQkcy6Di4YJu4xzU');
export const NETWORK_PROPERTY = Id('MuMLDVbHAmRjZQjhyk3HGx');
/*
 * @deprecated use NETWORK_PROPERTY
 */
export const NETWORK_ATTRIBUTE = Id('MuMLDVbHAmRjZQjhyk3HGx');
export const PERSON_TYPE = Id('GfN9BK2oicLiBHrUavteS8');
export const NETWORK_TYPE = Id('YCLXoVZho6C4S51g4AbF3C');

export const GEO_LOCATION_PROPERTY = Id('GSA7HUQwsUbMJQ2RDGNi2W');
export const GOALS_PROPERTY = Id('WNcdorfdj7ZprmwvmRiRtG');
/*
 * @deprecated use GOALS_PROPERTY
 */
export const GOALS_ATTRIBUTE = Id('WNcdorfdj7ZprmwvmRiRtG');
export const GOAL_TYPE = Id('2y44qmFiLjZWmgkZ64EM7c');
export const MEMBERSHIP_CONTRACT_ADDRESS = Id('DDkwCoB8p1mHzXTedShcFv');
export const MISSION_PROPERTY = Id('VGbyCo12NC8yTUhnhMHu1z');
/*
 * @deprecated use MISSION_PROPERTY
 */
export const MISSION_ATTRIBUTE = Id('VGbyCo12NC8yTUhnhMHu1z');
export const PLACEHOLDER_IMAGE = Id('ENYn2afpf2koqBfyff7CGE');
export const PLACEHOLDER_TEXT = Id('AuihGk1yXCkfCcpMSwhfho');
export const TAB_TYPE = Id('6ym81VzJiHx32nV8e5h52q');
export const ROLE_PROPERTY = Id('VGKSRGzxCRvQxpJP7CB4wj');
/*
 * @deprecated use ROLE_PROPERTY
 */
export const ROLE_ATTRIBUTE = Id('VGKSRGzxCRvQxpJP7CB4wj');

// Do we still need these?
export const DEFAULT_TYPE = Id('7nJuuYkrKT62HCFxDygF1S');
export const BROADER_CLAIMS_PROPERTY = Id('RWkXuBRdVqDAiHKQisTZZ4');
/*
 * @deprecated use BROADER_CLAIMS_PROPERTY
 */
export const BROADER_CLAIMS_ATTRIBUTE = Id('RWkXuBRdVqDAiHKQisTZZ4');
export const CLAIMS_FROM_PROPERTY = Id('JdNBawSt1fp9EdozJdmThR');
/*
 * @deprecated use CLAIMS_FROM_PROPERTY
 */
export const CLAIMS_FROM_ATTRIBUTE = Id('JdNBawSt1fp9EdozJdmThR');
export const DEFINITIONS_PROPERTY = Id('256myJaotY6FB6wGiC5mtk');
/*
 * @deprecated use DEFINITIONS_PROPERTY
 */
export const DEFINITIONS_ATTRIBUTE = Id('256myJaotY6FB6wGiC5mtk');
export const EMAIL_PROPERTY = Id('2QafYRmRHP2Hd18W3Tj9zu');
/*
 * @deprecated use EMAIL_PROPERTY
 */
export const EMAIL_ATTRIBUTE = Id('2QafYRmRHP2Hd18W3Tj9zu');
export const FOREIGN_TYPES = Id('R32hqus9ojU3Twsz3HDuxf');
export const NONPROFIT_CATEGORIES_PROPERTY = Id('64uVL5vKHmfqBC94hwNzHZ');
/*
 * @deprecated use NONPROFIT_CATEGORIES_PROPERTY
 */
export const NONPROFIT_CATEGORIES_ATTRIBUTE = Id('64uVL5vKHmfqBC94hwNzHZ');
export const PHONE_NUMBER_PROPERTY = Id('3zhuyrcqFjeaVgC5oHHqTJ');
/*
 * @deprecated use PHONE_NUMBER_PROPERTY
 */
export const PHONE_NUMBER_ATTRIBUTE = Id('3zhuyrcqFjeaVgC5oHHqTJ');
export const QUOTES_PROPERTY = Id('XXAf2w4C5f4URDhhpH8nUG');
/*
 * @deprecated use QUOTES_PROPERTY
 */
export const QUOTES_ATTRIBUTE = Id('XXAf2w4C5f4URDhhpH8nUG');
export const REGION_PROPERTY = Id('CGC6KXy8wcqf7vpZv8HH4i');
/*
 * @deprecated use REGION_PROPERTY
 */
export const REGION_ATTRIBUTE = Id('CGC6KXy8wcqf7vpZv8HH4i');
export const RELATED_TOPICS_PROPERTY = Id('SDw38koZeFukda9FWU9bfW');
/*
 * @deprecated use RELATED_TOPICS_PROPERTY
 */
export const RELATED_TOPICS_ATTRIBUTE = Id('SDw38koZeFukda9FWU9bfW');
export const RELEVANT_QUESTIONS_PROPERTY = Id('Po4uUtzinhjDwXJP5QNCMp');
/*
 * @deprecated use RELEVANT_QUESTIONS_PROPERTY
 */
export const RELEVANT_QUESTIONS_ATTRIBUTE = Id('Po4uUtzinhjDwXJP5QNCMp');
export const SPEAKERS_PROPERTY = Id('9nZuGhssmkEBn9DtRca8Gm');
/*
 * @deprecated use SPEAKERS_PROPERTY
 */
export const SPEAKERS_ATTRIBUTE = Id('9nZuGhssmkEBn9DtRca8Gm');
export const STREET_ADDRESS_PROPERTY = Id('8kx7oQvdCZRXLfUksucwCv');
/*
 * @deprecated use STREET_ADDRESS_PROPERTY
 */
export const STREET_ADDRESS_ATTRIBUTE = Id('8kx7oQvdCZRXLfUksucwCv');
export const SUBCLAIMS_PROPERTY = Id('2DFyYPbh5Yy2PnWTbi3uL5');
/*
 * @deprecated use SUBCLAIMS_PROPERTY
 */
export const SUBCLAIMS_ATTRIBUTE = Id('2DFyYPbh5Yy2PnWTbi3uL5');
export const VALUES_PROPERTY = Id('3c5k2MpF9PRYAZ925qTKNi');
/*
 * @deprecated use VALUES_PROPERTY
 */
export const VALUES_ATTRIBUTE = Id('3c5k2MpF9PRYAZ925qTKNi');
export const VISION_PROPERTY = Id('AAMDNTaJtS2i4aWp59zEAk');
/*
 * @deprecated use VISION_PROPERTY
 */
export const VISION_ATTRIBUTE = Id('AAMDNTaJtS2i4aWp59zEAk');

export const CURRENCY_ATTRIBUTE = Id('K6kJ6TTwwCcc3Dfdtbradv');
export const CURRENCY_SIGN_ATTRIBUTE = Id('Tt2mYqE1kJTRLt2iLQjATb');
export const CURRENCY_SYMBOL_ATTRIBUTE = Id('NMCZXJNatQS59U31sZKmMn');
export const CURRENCY_USD_ATTRIBUTE = Id('K6kJ6TTwwCcc3Dfdtbradv');
export const CURRENCY_GBP_ATTRIBUTE = Id('K6kJ6TTwwCcc3Dfdtbradv');
export const CURRENCY_EUR_ATTRIBUTE = Id('25omwWh6HYgeRQKCaSpVpa');

export const ROOT_SPACE_ID = Id('25omwWh6HYgeRQKCaSpVpa');
