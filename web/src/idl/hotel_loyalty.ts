
export type Anchor = {
  "version": "0.1.0",
  "name": "anchor",
  "instructions": [
    {
      "name": "addPoints",
      "accounts": [
        {
          "name": "membershipToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "points",
          "type": "u64"
        }
      ]
    },
    {
      "name": "calculateAndUpdatePoints",
      "accounts": [
        {
          "name": "membershipToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initializeHotel",
      "accounts": [
        {
          "name": "hotel",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "verified",
          "type": "bool"
        }
      ]
    },
    {
      "name": "mintMembershipToken",
      "accounts": [
        {
          "name": "hotel",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "membershipToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "hotelAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeemPoints",
      "accounts": [
        {
          "name": "membershipToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "pointsToRedeem",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Hotel",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hotelId",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "verified",
            "type": "bool"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tokenSupply",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "Membership",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "hotel",
            "type": "publicKey"
          },
          {
            "name": "tokenCount",
            "type": "u64"
          },
          {
            "name": "pointsBalance",
            "type": "u64"
          },
          {
            "name": "lastPointsUpdate",
            "type": "i64"
          },
          {
            "name": "multiplier",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "HotelNotVerified",
      "msg": "Hotel is not verified."
    },
    {
      "code": 6001,
      "name": "InvalidHotelOwner",
      "msg": "Invalid hotel owner."
    },
    {
      "code": 6002,
      "name": "InsufficientPoints",
      "msg": "Insufficient points to redeem."
    }
  ]
};

export const IDL: Anchor = {
  "version": "0.1.0",
  "name": "anchor",
  "instructions": [
    {
      "name": "addPoints",
      "accounts": [
        {
          "name": "membershipToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "points",
          "type": "u64"
        }
      ]
    },
    {
      "name": "calculateAndUpdatePoints",
      "accounts": [
        {
          "name": "membershipToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "initializeHotel",
      "accounts": [
        {
          "name": "hotel",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "verified",
          "type": "bool"
        }
      ]
    },
    {
      "name": "mintMembershipToken",
      "accounts": [
        {
          "name": "hotel",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "membershipToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "hotelAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeemPoints",
      "accounts": [
        {
          "name": "membershipToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "pointsToRedeem",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Hotel",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hotelId",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "verified",
            "type": "bool"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tokenSupply",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "Membership",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "hotel",
            "type": "publicKey"
          },
          {
            "name": "tokenCount",
            "type": "u64"
          },
          {
            "name": "pointsBalance",
            "type": "u64"
          },
          {
            "name": "lastPointsUpdate",
            "type": "i64"
          },
          {
            "name": "multiplier",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "HotelNotVerified",
      "msg": "Hotel is not verified."
    },
    {
      "code": 6001,
      "name": "InvalidHotelOwner",
      "msg": "Invalid hotel owner."
    },
    {
      "code": 6002,
      "name": "InsufficientPoints",
      "msg": "Insufficient points to redeem."
    }
  ]
};
