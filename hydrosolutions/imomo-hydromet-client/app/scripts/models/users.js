( function ( global ) {
  'use strict';

  /**
   * Factory function for the User class.
   *
   * @return {User#constructor} The constructor for the class.
   */
  function UserFactory() {
    /**
     * Constructor for the User class. It creates an instance of a user
     * with the given properties.
     *
     * @class User
     * @classdesc User model which is equivalent to the User table in the
     *            backend.
     * @param {Object} options Properties to initialize the model.
     */
    function User( options ) {
      options = options || {};
      /**
       * The id of the user instance in the backend.
       *
       * @name User#id
       * @type {Number}
       * @public
       * @default null
       */
      this.id = options.id || null;
      /**
       * The username.
       *
       * @name User#username
       * @type {external:String}
       * @public
       * @default null
       */
      this.username = options.username || null;
      /**
       * The password.
       * Note: This attribute should only be populated by the user on the
       *       client side, this attribute gets populated by a server object
       *       then probably something is VERY WRONG.
       *
       * @name User#password
       * @type {external:String}
       * @public
       * @default null
       */
      this.password = options.password || null;
      /**
       * The email.
       *
       * @name User#email
       * @type {external:String}
       * @public
       * @default null
       */
      this.email = options.email || null;
      /**
       * The full name.
       *
       * @name User#fullName
       * @type {external:String}
       * @public
       * @default null
       */
      this.fullName = options.fullName || null;
      /**
       * The id of the data source organization to which the user belongs.
       *
       * @name User#sourceId
       * @type {Number}
       * @public
       * @default null
       */
      this.sourceId = options.sourceId || null;
      /**
       * The date when the user registered in the system.
       *
       * @name User#registeredOn
       * @type {external:Moment}
       * @public
       * @default
       */
      this.registeredOn = options.registeredOn || null;
      /**
       * Indicates if the user has already been approved.
       *
       * @name User#approved
       * @type {Boolean}
       * @public
       * @default false
       */
      this.approved = options.approved || false;
      /**
       * Id of the approving user.
       *
       * @name User#approvedById
       * @type {Number}
       * @public
       * @default null
       */
      this.approvedById = options.approvedById || null;
    }

    /**
     * Serialization method for the model.
     *
     * @public
     * @instance
     * @memberOf User
     * @return {Object} JSON object representing the user instance.
     */
    function toServerObject () {
      return {
        username: this.username,
        password: this.password,
        email: this.email,
        fullName: this.fullName,
        sourceId: this.sourceId,
        registeredOn: moment().unix(),
      };
    }
    User.prototype.toServerObject = toServerObject;

    /**
     * Factory function to create a new {@link User} instance from a JSON
     * resource from the backend.
     *
     * @static
     * @memberOf User
     * @param  {Object} serverUser A JSON object produced by the backend
     *                             to represent a user instance.
     * @return {User} The client-side instance corresponding
     *                to the object sent by the server.
     */
    function fromServerObject( serverUser ) {
      // Remove a password if it was accidentally sent by the server.
      // TODO: This should basically call the KGB for help instead of just
      //       sweeping the fact under the rug.
      serverUser.password = undefined;
      // Parse the registeredOn timestamp
      serverUser.registeredOn = moment.unix( serverUser.registeredOn );
      return new User( serverUser );
    }
    User.fromServerObject = fromServerObject;

    return User;
  }

  global.angular.module( 'imomoCaApp' ).factory( 'User', UserFactory );

} )( window );
