/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/torrent.json`.
 */
export type Torrent = {
  "address": "Au1tsG1thDEY9gaGdh7CPDUbEE8J3G5ykBGQjQdD6vzt",
  "metadata": {
    "name": "torrent",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createAgreement",
      "discriminator": [
        220,
        156,
        65,
        172,
        252,
        68,
        74,
        233
      ],
      "accounts": [
        {
          "name": "rentalAgreement",
          "writable": true,
          "signer": true
        },
        {
          "name": "landlord",
          "writable": true,
          "signer": true
        },
        {
          "name": "tenant",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "rentAmount",
          "type": "u64"
        },
        {
          "name": "depositAmount",
          "type": "u64"
        },
        {
          "name": "durationMonths",
          "type": "u8"
        },
        {
          "name": "ipfsCid",
          "type": "string"
        }
      ]
    },
    {
      "name": "payRent",
      "discriminator": [
        69,
        155,
        112,
        183,
        178,
        234,
        94,
        100
      ],
      "accounts": [
        {
          "name": "rentalAgreement",
          "writable": true
        },
        {
          "name": "tenant",
          "writable": true,
          "signer": true,
          "relations": [
            "rentalAgreement"
          ]
        },
        {
          "name": "landlord",
          "writable": true,
          "relations": [
            "rentalAgreement"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "resolveMaintenanceRequest",
      "discriminator": [
        255,
        201,
        45,
        244,
        181,
        1,
        132,
        179
      ],
      "accounts": [
        {
          "name": "rentalAgreement",
          "writable": true
        },
        {
          "name": "landlord",
          "signer": true,
          "relations": [
            "rentalAgreement"
          ]
        }
      ],
      "args": [
        {
          "name": "requestIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "submitMaintenanceRequest",
      "discriminator": [
        85,
        11,
        127,
        211,
        67,
        168,
        85,
        7
      ],
      "accounts": [
        {
          "name": "rentalAgreement",
          "writable": true
        },
        {
          "name": "tenant",
          "signer": true,
          "relations": [
            "rentalAgreement"
          ]
        }
      ],
      "args": [
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "terminateAgreement",
      "discriminator": [
        208,
        216,
        203,
        98,
        252,
        183,
        244,
        247
      ],
      "accounts": [
        {
          "name": "rentalAgreement",
          "writable": true
        },
        {
          "name": "landlord",
          "writable": true,
          "signer": true,
          "relations": [
            "rentalAgreement"
          ]
        },
        {
          "name": "tenant",
          "writable": true,
          "signer": true,
          "relations": [
            "rentalAgreement"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateAgreement",
      "discriminator": [
        231,
        59,
        90,
        24,
        226,
        213,
        155,
        54
      ],
      "accounts": [
        {
          "name": "rentalAgreement",
          "writable": true
        },
        {
          "name": "landlord",
          "signer": true,
          "relations": [
            "rentalAgreement"
          ]
        },
        {
          "name": "tenant",
          "signer": true,
          "relations": [
            "rentalAgreement"
          ]
        }
      ],
      "args": [
        {
          "name": "rentAmount",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "depositAmount",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "durationMonths",
          "type": {
            "option": "u8"
          }
        },
        {
          "name": "ipfsCid",
          "type": {
            "option": "string"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "rentalAgreement",
      "discriminator": [
        84,
        206,
        204,
        146,
        240,
        218,
        19,
        14
      ]
    }
  ],
  "events": [
    {
      "name": "agreementCreated",
      "discriminator": [
        131,
        148,
        204,
        18,
        83,
        92,
        57,
        18
      ]
    },
    {
      "name": "agreementTerminated",
      "discriminator": [
        100,
        113,
        135,
        45,
        62,
        124,
        25,
        183
      ]
    },
    {
      "name": "agreementUpdated",
      "discriminator": [
        96,
        59,
        191,
        31,
        127,
        151,
        49,
        237
      ]
    },
    {
      "name": "maintenanceRequestResolved",
      "discriminator": [
        202,
        66,
        224,
        79,
        163,
        242,
        220,
        191
      ]
    },
    {
      "name": "maintenanceRequestSubmitted",
      "discriminator": [
        152,
        112,
        15,
        186,
        191,
        243,
        20,
        130
      ]
    },
    {
      "name": "rentPaid",
      "discriminator": [
        140,
        29,
        172,
        69,
        152,
        38,
        73,
        241
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "agreementInactive",
      "msg": "Rental agreement is inactive."
    },
    {
      "code": 6001,
      "name": "paymentNotDue",
      "msg": "Rent payment is not due yet."
    },
    {
      "code": 6002,
      "name": "invalidAmount",
      "msg": "Invalid amount specified."
    },
    {
      "code": 6003,
      "name": "invalidDuration",
      "msg": "Invalid duration specified."
    },
    {
      "code": 6004,
      "name": "invalidIpfsCid",
      "msg": "Invalid IPFS CID length."
    },
    {
      "code": 6005,
      "name": "contractExpired",
      "msg": "Contract has expired."
    },
    {
      "code": 6006,
      "name": "unauthorizedTermination",
      "msg": "Unauthorized termination attempt."
    },
    {
      "code": 6007,
      "name": "invalidDescription",
      "msg": "Invalid maintenance request description length."
    },
    {
      "code": 6008,
      "name": "invalidRequestIndex",
      "msg": "Invalid maintenance request index."
    }
  ],
  "types": [
    {
      "name": "agreementCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "landlord",
            "type": "pubkey"
          },
          {
            "name": "tenant",
            "type": "pubkey"
          },
          {
            "name": "rentAmount",
            "type": "u64"
          },
          {
            "name": "depositAmount",
            "type": "u64"
          },
          {
            "name": "durationMonths",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "agreementTerminated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agreement",
            "type": "pubkey"
          },
          {
            "name": "remainingDeposit",
            "type": "u64"
          },
          {
            "name": "deductions",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "agreementUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agreement",
            "type": "pubkey"
          },
          {
            "name": "rentAmount",
            "type": "u64"
          },
          {
            "name": "depositAmount",
            "type": "u64"
          },
          {
            "name": "durationMonths",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "maintenanceRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "isResolved",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "maintenanceRequestResolved",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agreement",
            "type": "pubkey"
          },
          {
            "name": "requestIndex",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "maintenanceRequestSubmitted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agreement",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "rentPaid",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "agreement",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "paymentDate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "rentalAgreement",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "landlord",
            "type": "pubkey"
          },
          {
            "name": "tenant",
            "type": "pubkey"
          },
          {
            "name": "rentAmount",
            "type": "u64"
          },
          {
            "name": "depositAmount",
            "type": "u64"
          },
          {
            "name": "durationMonths",
            "type": "u8"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "nextPaymentDate",
            "type": "i64"
          },
          {
            "name": "lastPaymentDate",
            "type": "i64"
          },
          {
            "name": "ipfsCid",
            "type": "string"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "missedPayments",
            "type": "u8"
          },
          {
            "name": "maintenanceRequests",
            "type": {
              "vec": {
                "defined": {
                  "name": "maintenanceRequest"
                }
              }
            }
          }
        ]
      }
    }
  ]
};
