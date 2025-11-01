# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ============================================
# OBFUSCATION SETTINGS
# ============================================
# Note: R8 enables obfuscation by default when minifyEnabled=true
# Generate mapping file for deobfuscating crash reports
-printmapping mapping.txt

# Optimization settings
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# ============================================
# CAPACITOR / JAVASCRIPT BRIDGE
# ============================================
# Keep Capacitor classes (required for JavaScript bridge)
-keep class io.capacitor.** { *; }
-keep class com.capacitorjs.** { *; }
-keep class com.getcapacitor.** { *; }

# Keep Capacitor native classes that are called from JavaScript
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public <methods>;
}

# Keep JavaScript interface (required for WebView communication)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep JavaScript bridge methods
-keepclassmembers,allowobfuscation class * {
    @com.getcapacitor.BridgePlugin <methods>;
}

# ============================================
# ANDROID FRAMEWORK
# ============================================
# Keep application class
-keep public class * extends android.app.Application
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep R class (resource references)
-keep class **.R
-keep class **.R$* {
    <fields>;
}

# ============================================
# DATA CLASSES
# ============================================
# Keep serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep Parcelable classes
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ============================================
# REFLECTION & METADATA
# ============================================
# Keep annotations (required for reflection)
-keepattributes *Annotation*
-keepattributes RuntimeVisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations
-keepattributes AnnotationDefault

# Keep generic signatures
-keepattributes Signature

# Keep inner classes
-keepattributes InnerClasses,EnclosingMethod

# Keep line numbers for debugging (renamed to hide source)
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ============================================
# LEGACY SUPPORT (if using React Native or other frameworks)
# ============================================
# Keep React Native classes (if applicable)
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
