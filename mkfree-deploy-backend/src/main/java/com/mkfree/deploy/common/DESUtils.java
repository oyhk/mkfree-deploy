package com.mkfree.deploy.common;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.*;
import javax.crypto.spec.DESKeySpec;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

/**
 * Created by oyhk on 2018/1/25.
 */
public class DESUtils {

    private static final String key = "dfurlasjdvhxv4*&^^24*^%$^(aso4804586%^$#%UII032094724";


    /**
     * 加密字符串
     * @param plainText
     * @return
     */
    public static String encryption(String plainText) {
        try {
            SecureRandom random = new SecureRandom();
            DESKeySpec keySpec = new DESKeySpec(key.getBytes());

            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("des");
            SecretKey secretKey = keyFactory.generateSecret(keySpec);

            Cipher cipher = Cipher.getInstance("des");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, random);
            byte[] cipherData = cipher.doFinal(plainText.getBytes());
            return new BASE64Encoder().encode(cipherData);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 解密字符串
     * @param cipherText
     * @return
     */
    public static String decryption(String cipherText) {
        try {
            SecureRandom random = new SecureRandom();
            DESKeySpec keySpec = new DESKeySpec(key.getBytes());

            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("des");
            SecretKey secretKey = keyFactory.generateSecret(keySpec);
            Cipher cipher = Cipher.getInstance("des");
            byte[] base64Decoder = new BASE64Decoder().decodeBuffer(cipherText);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, random);
            byte[] plainData = cipher.doFinal(base64Decoder);
            return new String(plainData);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
