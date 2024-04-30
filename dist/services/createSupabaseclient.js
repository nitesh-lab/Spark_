"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = (process.env.supabase_url);
const supabaseKey = (process.env.supabase_key);
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
//# sourceMappingURL=createSupabaseclient.js.map