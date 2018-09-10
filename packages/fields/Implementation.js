const inflection = require('inflection');
const { parseFieldAccess, testFieldAccessControl } = require('@keystonejs/access-control');

class Field {
  constructor(
    path,
    config,
    { getListByKey, listKey, listAdapter, fieldAdapterClass, defaultAccess }
  ) {
    this.path = path;
    this.config = config;
    this.getListByKey = getListByKey;
    this.listKey = listKey;
    this.label = config.label || inflection.humanize(path);
    this.adapter = listAdapter.newFieldAdapter(
      fieldAdapterClass,
      this.constructor.name,
      path,
      getListByKey,
      config
    );

    this.access = parseFieldAccess({
      listKey,
      fieldKey: path,
      defaultAccess,
      access: config.access,
    });
  }

  // Field types should replace this if they want to any fields to the output type
  get gqlOutputFields() {
    return [];
  }
  get gqlOutputFieldResolvers() {
    return {};
  }

  /**
   * Auxiliary Types are top-level types which a type may need or provide.
   * Example: the `File` type, adds a graphql auxiliary type of `FileUpload`, as
   * well as an `uploadFile()` graphql auxiliary type query resolver
   *
   * These are special cases, and should be used sparingly
   *
   * NOTE: When a naming conflic occurs, a list's types/queries/mutations will
   * overwrite any auxiliary types defined by an individual type.
   */
  get gqlAuxTypes() {
    return [];
  }
  get gqlAuxFieldResolvers() {
    return {};
  }

  get gqlAuxQueries() {
    return [];
  }
  get gqlAuxQueryResolvers() {
    return {};
  }

  get gqlAuxMutations() {
    return [];
  }
  get gqlAuxMutationResolvers() {
    return {};
  }

  /**
   * Hooks for performing actions before / after fields are mutated.
   * For example: with a field { avatar: { type: File }}, it wants to put the
   * file on S3 in the `createFieldPreHook()`, then return asn S3 object ID as
   * the result to store in `avatar`
   *
   * @param data {Mixed} The data received from the query
   * @param path {String} The path of the field in the item
   * @param context {Mixed} The GraphQL Context object for the current request
   */
  // eslint-disable-next-line no-unused-vars
  createFieldPreHook(data, path, context) {
    return data;
  }
  /*
   * @param data {Mixed} The data as saved & read from the DB
   * @param path {String} The path of the field in the item
   * @param item {Object} The existing version of the item
   * @param context {Mixed} The GraphQL Context object for the current request
   */
  createFieldPostHook(data, path, item, context) {} // eslint-disable-line no-unused-vars
  /*
   * @param data {Mixed} The data received from the query
   * @param path {String} The path of the field in the item
   * @param item {Object} The existing version of the item
   * @param context {Mixed} The GraphQL Context object for the current request
   */
  // eslint-disable-next-line no-unused-vars
  updateFieldPreHook(data, path, item, context) {
    return data;
  }
  /*
   * @param data {Mixed} The data as saved & read from the DB
   * @param path {String} The path of the field in the item
   * @param item {Object} The existing version of the item
   * @param context {Mixed} The GraphQL Context object for the current request
   */
  updateFieldPostHook(data, path, item, context) {} // eslint-disable-line no-unused-vars

  get gqlQueryInputFields() {
    return [];
  }
  get gqlCreateInputFields() {
    return [];
  }
  get gqlUpdateInputFields() {
    return [];
  }

  getAdminMeta() {
    return this.extendAdminMeta({
      label: this.label,
      path: this.path,
      type: this.constructor.name,
      defaultValue: this.getDefaultValue(),
    });
  }
  extendAdminMeta(meta) {
    return meta;
  }
  getDefaultValue() {
    return this.config.defaultValue;
  }
  testAccessControl({ listKey, item, operation, authentication }) {
    return testFieldAccessControl({
      access: this.access,
      item,
      operation,
      authentication,
      fieldKey: this.path,
      listKey,
    });
  }
}

module.exports = {
  Implementation: Field,
};
