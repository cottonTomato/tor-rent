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
          "signer": true
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
          "writable": true,
          "signer": true,
          "relations": [
            "rentalAgreement"
          ]
        },
        {
          "name": "tenant",
          "writable": true,
          "signer": true
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
  "types": [
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
            "name": "ipfsCid",
            "type": "string"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
