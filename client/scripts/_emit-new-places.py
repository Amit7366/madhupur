# -*- coding: utf-8 -*-
"""Emit gen-map-places.mjs fragment: all Bengali as \\u escapes (ASCII-only source)."""
import json


def esc(s: str) -> str:
    out = []
    for ch in s:
        o = ord(ch)
        if o < 128:
            out.append(ch)
        else:
            out.append("\\u%04x" % o)
    return "".join(out)


def U(*parts: str) -> str:
    return "".join(parts)


entries = [
    (
        "jalchatra-bazar",
        "bazar",
        {
            "name_bn": U("\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0"),
            "addr_bn": U(
                "\u0986\u09b0\u09a8\u0996\u09cb\u09b2\u09be \u0987\u0989\u09a8\u09bf\u09af\u09bc\u09a8, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"
            ),
            "desc_bn": U(
                "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u099f\u09cd\u09b0\u09cd\u09af\u09be\u0995\u09cd\u099f\u09c7\u09b0 \u09ac\u09dc \u09b9\u09be\u099f\u2014\u0986\u09a8\u09be\u09b0\u09b8 \u0993 \u0995\u09b2\u09be \u09ac\u09bf\u0995\u09cd\u09b0\u09bf\u09b0 \u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u0995\u09c7\u09a8\u09cd\u09a6\u09cd\u09b0; "
                "\u09a6\u09c2\u09b0\u09a6\u09c2\u09b0\u09be\u09a8\u09cd\u09a4 \u099c\u09be\u09af\u09bc\u0997\u09be \u09a5\u09c7\u0995\u09c7 \u0986\u09a1\u09bc\u09a4\u09a6\u09be\u09b0 \u0993 \u09aa\u09be\u0987\u0995\u09be\u09b0 \u0986\u09b8\u09c7\u09a8\u0964 "
                "\u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09ad\u09be\u09ac\u09c7 \u2018\u099c\u09b2\u099b\u09a4\u09cd\u09b0\u2019 \u09a8\u09be\u09ae\u09c7 \u09aa\u09b0\u09bf\u099a\u09bf\u09a4\u0964"
            ),
            "svc_bn": U(
                "\u0996\u09c1\u099a\u09b0\u09be \u0993 \u09aa\u09be\u0987\u0995\u09be\u09b0\u09bf \u09ab\u09b2 \u00b7 \u09b9\u09be\u099f\u09c7\u09b0 \u09a6\u09bf\u09a8\u09c7 \u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4 \u09b8\u09cd\u099f\u09b2 \u00b7 \u09aa\u09b0\u09bf\u09ac\u09b9\u09a8 \u09b8\u0982\u09af\u09cb\u0997"
            ),
            "hr_bn": U(
                "\u09ad\u09cb\u09b0 \u09a5\u09c7\u0995\u09c7 \u09b8\u09a8\u09cd\u09a7\u09cd\u09af\u09be \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 (\u09b9\u09be\u099f\u09c7\u09b0 \u09a6\u09bf\u09a8 \u0993 \u09ae\u09cc\u09b8\u09c1\u09ae\u09c7 \u09b8\u09ae\u09af\u09bc \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7)\u0964"
            ),
            "duty_bn": U(
                "\u09ac\u09be\u099c\u09be\u09b0 \u0995\u09ae\u09bf\u099f\u09bf / \u09ac\u09cd\u09af\u09ac\u09b8\u09cd\u09a5\u09be\u09aa\u09a8\u09be \u09b6\u09be\u0996\u09be"
            ),
        },
    ),
    (
        "madhupur-bus-stand-bazar",
        "bazar",
        {
            "name_bn": U(
                "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09ac\u09be\u09b8 \u09b8\u09cd\u099f\u09cd\u09af\u09be\u09a8\u09cd\u09a1 \u098f\u09b2\u09be\u0995\u09be\u09b0 \u09ae\u09c2\u09b2 \u09ac\u09be\u099c\u09be\u09b0"
            ),
            "addr_bn": U(
                "\u099f\u09cd\u09b0\u09be\u0987-\u099c\u0982\u09b6\u09a8 \u09b8\u0982\u09b2\u0997\u09cd\u09a8, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09aa\u09cc\u09b0 \u098f\u09b2\u09be\u0995\u09be, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"
            ),
            "desc_bn": U(
                "\u099f\u09be\u0982\u0997\u09be\u0987\u09b2, \u09ae\u09df\u09ae\u09a8\u09b8\u09bf\u0982\u09b9 \u0993 \u099c\u09be\u09ae\u09be\u09b2\u09aa\u09c1\u09b0\u0997\u09be\u09ae\u09c0 \u09b8\u09dc\u0995\u09c7\u09b0 \u09ae\u09cb\u09a1\u09bc\u09c7 \u0997\u09a1\u09bc\u09c7 \u0989\u09a0\u09be \u09a6\u09c8\u09a8\u09a8\u09cd\u09a6\u09bf\u09a8 \u09ac\u09be\u099c\u09be\u09b0\u2014"
                "\u0995\u09be\u099a\u09be\u09ae\u09be\u09b2, \u09ae\u09c1\u09a6\u09bf, \u0995\u09be\u09aa\u09a1\u09bc \u0993 \u09af\u09be\u09a4\u09cd\u09b0\u09c0\u09b8\u09c7\u09ac\u09be\u09b0 \u09a6\u09cb\u0995\u09be\u09a8\u09aa\u09be\u099f\u0964"
            ),
            "svc_bn": U(
                "\u09ae\u09c1\u09a6\u09bf \u0993 \u0995\u09be\u099a\u09be\u09ae\u09be\u09b2 \u00b7 \u0995\u09be\u09aa\u09a1\u09bc \u00b7 \u099b\u09cb\u099f \u0996\u09be\u09ac\u09be\u09b0 \u00b7 \u09af\u09be\u09a4\u09cd\u09b0\u09c0 \u09b8\u09c1\u09ac\u09bf\u09a7\u09be"
            ),
            "hr_bn": U(
                "\u09b8\u0995\u09be\u09b2 \u09a5\u09c7\u0995\u09c7 \u09b0\u09be\u09a4 \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 (\u09a6\u09cb\u0995\u09be\u09a8 \u0985\u09a8\u09c1\u09af\u09bc\u09be\u09af\u09bc\u09c0 \u09ad\u09bf\u09a8\u09cd\u09a8)\u0964"
            ),
            "duty_bn": U(
                "\u09ac\u09be\u099c\u09be\u09b0 \u0995\u09ae\u09bf\u099f\u09bf / \u09aa\u09cc\u09b0\u09b8\u09ad\u09be \u09ac\u09be\u099c\u09be\u09b0 \u09b6\u09be\u0996\u09be"
            ),
        },
    ),
    (
        "madhupur-sadar-jame-mosque",
        "mosque",
        {
            "name_bn": U(
                "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b8\u09a6\u09b0 \u0995\u09c7\u09a8\u09cd\u09a6\u09cd\u09b0\u09c0\u09af\u09bc \u099c\u09be\u09ae\u09c7 \u09ae\u09b8\u099c\u09bf\u09a6"
            ),
            "addr_bn": U(
                "\u09aa\u09cc\u09b0\u09b8\u09ad\u09be \u098f\u09b2\u09be\u0995\u09be, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"
            ),
            "desc_bn": U(
                "\u09aa\u09cc\u09b0 \u098f\u09b2\u09be\u0995\u09be\u09b0 \u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u099c\u09be\u09ae\u09c7 \u09ae\u09b8\u099c\u09bf\u09a6\u2014\u09aa\u09be\u0981\u099a \u0993\u09af\u09bc\u09be\u0995\u09cd\u09a4 \u0993 \u099c\u09c1\u09ae\u09be\u09b0 \u09a8\u09be\u09ae\u09be\u099c, "
                "\u09ae\u09be\u09a6\u09cd\u09b0\u09be\u09b8\u09be \u0995\u09be\u09b0\u09cd\u09af\u09bf\u0995\u09cd\u09b0\u09ae \u0993 \u09a7\u09b0\u09cd\u09ae\u09c0\u09af\u09bc \u0986\u09df\u09cb\u099c\u09a8\u0964 "
                "\u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u09a8\u09cb\u099f\u09bf\u09b8 \u09a5\u09c7\u0995\u09c7 \u09b8\u09ae\u09af\u09bc\u09b8\u09c2\u099a\u09bf \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09c1\u09a8\u0964"
            ),
            "svc_bn": U(
                "\u09aa\u09be\u0981\u099a \u0993\u09af\u09bc\u09be\u0995\u09cd\u09a4 \u09a8\u09be\u09ae\u09be\u099c \u00b7 \u099c\u09c1\u09ae\u09be \u00b7 \u099c\u09be\u09a8\u09be\u099c\u09be \u0993 \u09ae\u09be\u09a6\u09cd\u09b0\u09be\u09b8\u09be \u09b8\u09b9\u09be\u09af\u09bc\u09a4\u09be"
            ),
            "hr_bn": U(
                "\u09ab\u099c\u09b0 \u09a5\u09c7\u0995\u09c7 \u0987\u09b6\u09be \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 \u0996\u09cb\u09b2\u09be; \u099c\u09c1\u09ae\u09be\u09af\u09bc \u09ad\u09bf\u09a1\u09bc \u09ac\u09c7\u09b6\u09bf\u0964"
            ),
            "duty_bn": U(
                "\u0987\u09ae\u09be\u09ae / \u09ae\u09b8\u099c\u09bf\u09a6 \u09ac\u09cd\u09af\u09ac\u09b8\u09cd\u09a5\u09be\u09aa\u09a8\u09be \u0995\u09ae\u09bf\u099f\u09bf"
            ),
        },
    ),
    (
        "jalchatra-bazar-jame-mosque",
        "mosque",
        {
            "name_bn": U(
                "\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u099c\u09be\u09ae\u09c7 \u09ae\u09b8\u099c\u09bf\u09a6"
            ),
            "addr_bn": U(
                "\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u09b8\u0982\u09b2\u0997\u09cd\u09a8, \u0986\u09b0\u09a8\u0996\u09cb\u09b2\u09be, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0"
            ),
            "desc_bn": U(
                "\u09b9\u09be\u099f \u098f\u09b2\u09be\u0995\u09be\u09b0 \u099c\u09be\u09ae\u09c7 \u09ae\u09b8\u099c\u09bf\u09a6\u2014\u09ac\u09a3\u09bf\u0995, \u0995\u09c3\u09b7\u0995 \u0993 \u09aa\u09b0\u09bf\u09ac\u09b9\u09a8 \u0995\u09b0\u09cd\u09ae\u09c0\u09a6\u09c7\u09b0 "
                "\u099c\u09c1\u09ae\u09be \u0993 \u09a6\u09c8\u09a8\u09a8\u09cd\u09a6\u09bf\u09a8 \u09a8\u09be\u09ae\u09be\u099c\u09c7\u09b0 \u09b8\u09c1\u09ac\u09bf\u09a7\u09be\u0964"
            ),
            "svc_bn": U(
                "\u099c\u09c1\u09ae\u09be \u00b7 \u09aa\u09be\u0981\u099a \u0993\u09af\u09bc\u09be\u0995\u09cd\u09a4 \u00b7 \u0987\u09a6 \u0993 \u09a4\u09be\u09ac\u09be\u09b0\u0995 \u099c\u09be\u09ae\u09be\u09a4"
            ),
            "hr_bn": U("\u09a8\u09be\u09ae\u09be\u099c\u09c7\u09b0 \u0993\u09af\u09bc\u09be\u0995\u09cd\u09a4 \u0985\u09a8\u09c1\u09af\u09be\u09af\u09bc\u09c0\u0964"),
            "duty_bn": U(
                "\u0996\u09a4\u09bf\u09ac-\u0987\u09ae\u09be\u09ae / \u09ae\u09b8\u099c\u09bf\u09a6 \u0995\u09ae\u09bf\u099f\u09bf"
            ),
        },
    ),
    (
        "madhupur-hindu-mandir",
        "temple",
        {
            "name_bn": U(
                "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b9\u09bf\u09a8\u09cd\u09a6\u09c1 \u09b8\u09ae\u09cd\u09aa\u09cd\u09b0\u09a6\u09be\u09af\u09bc\u09c7\u09b0 \u09aa\u09c2\u099c\u09be \u09ae\u09a8\u09cd\u09a6\u09bf\u09b0"
            ),
            "addr_bn": U(
                "\u09aa\u09cc\u09b0 \u098f\u09b2\u09be\u0995\u09be, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"
            ),
            "desc_bn": U(
                "\u0989\u09aa\u099c\u09c7\u09b2\u09be\u09b0 \u09b9\u09bf\u09a8\u09cd\u09a6\u09c1 \u09b8\u09ae\u09cd\u09aa\u09cd\u09b0\u09a6\u09be\u09af\u09bc\u09c7\u09b0 \u09a8\u09bf\u09a4\u09cd\u09af \u09aa\u09c2\u099c\u09be \u0993 \u09aa\u09be\u09b0\u09cd\u09ac\u09a3\u2014\u09a6\u09c1\u09b0\u09cd\u0997\u09be\u09aa\u09c2\u099c\u09be, "
                "\u09b8\u09b0\u09b8\u09cd\u09ac\u09a4\u09c0 \u09aa\u09c2\u099c\u09be \u0987\u09a4\u09cd\u09af\u09be\u09a6\u09bf\u0964 \u09a8\u09bf\u09b0\u09cd\u09a6\u09bf\u09b7\u09cd\u099f \u09ae\u09a8\u09cd\u09a6\u09bf\u09b0 \u09a8\u09be\u09ae \u0993 \u0995\u09ae\u09bf\u099f\u09bf \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09ad\u09be\u09ac\u09c7 \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09c1\u09a8\u0964"
            ),
            "svc_bn": U(
                "\u09a8\u09bf\u09a4\u09cd\u09af \u09aa\u09c2\u099c\u09be \u00b7 \u09aa\u09be\u09b0\u09cd\u09ac\u09a3 \u00b7 \u09b8\u09ae\u09be\u099c \u0995\u09b2\u09cd\u09af\u09be\u09a3 \u0995\u09be\u09b0\u09cd\u09af\u09b8\u09c2\u099a\u09bf"
            ),
            "hr_bn": U(
                "\u09b8\u0995\u09be\u09b2 \u0993 \u09b8\u09a8\u09cd\u09a7\u09cd\u09af\u09be \u09aa\u09c2\u099c\u09be; \u09aa\u09be\u09b0\u09cd\u09ac\u09a3\u09c7 \u09b8\u09ae\u09af\u09bc\u09b8\u09c2\u099a\u09bf \u09ac\u09be\u09a1\u09bc\u09c7\u0964"
            ),
            "duty_bn": U(
                "\u09ae\u09a8\u09cd\u09a6\u09bf\u09b0 \u0995\u09ae\u09bf\u099f\u09bf / \u09aa\u09c1\u09b0\u09cb\u09b9\u09bf\u09a4"
            ),
        },
    ),
    (
        "madhupur-bus-stand-hotel",
        "restaurant",
        {
            "name_bn": U(
                "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09ac\u09be\u09b8 \u099f\u09be\u09b0\u09cd\u09ae\u09bf\u09a8\u09be\u09b2 \u09b9\u09cb\u099f\u09c7\u09b2 \u0993 \u09b0\u09c7\u09b8\u09cd\u099f\u09c1\u09b0\u09c7\u09a8\u09cd\u099f"
            ),
            "addr_bn": U(
                "\u09ac\u09be\u09b8 \u09b8\u09cd\u099f\u09cd\u09af\u09be\u09a8\u09cd\u09a1 \u09b8\u0982\u09b2\u0997\u09cd\u09a8, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"
            ),
            "desc_bn": U(
                "\u09af\u09be\u09a4\u09cd\u09b0\u09c0 \u0993 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09a6\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09ad\u09be\u09a4, \u09a4\u09b0\u0995\u09be\u09b0\u09bf, \u0995\u09be\u09ac\u09be\u09ac \u0993 \u09a8\u09be\u09b8\u09cd\u09a4\u09be\u09b0 \u09ae\u09a4\u09cb \u09b8\u09be\u09a7\u09be\u09b0\u09a3 \u0996\u09be\u09ac\u09be\u09b0\u0964 "
                "\u09b8\u0995\u09be\u09b2\u09c7\u09b0 \u099a\u09be-\u09aa\u09b0\u09cb\u099f\u09be \u09a5\u09c7\u0995\u09c7 \u09b0\u09be\u09a4\u09c7\u09b0 \u0996\u09be\u09ac\u09be\u09b0\u2014\u09a6\u09cb\u0995\u09be\u09a8 \u0985\u09a8\u09c1\u09af\u09bc\u09be\u09af\u09bc\u09c0 \u09ae\u09c7\u09a8\u09c1 \u09ad\u09bf\u09a8\u09cd\u09a8\u0964"
            ),
            "svc_bn": U(
                "\u09b8\u09c7\u099f \u09ae\u09c7\u09a8\u09c1 \u00b7 \u09a8\u09be\u09b8\u09cd\u09a4\u09be \u00b7 \u099a\u09be-\u0995\u09ab\u09bf \u00b7 \u09aa\u09cd\u09af\u09be\u0995\u09c7\u099f\u09c7 \u09a8\u09bf\u09af\u09bc\u09c7 \u09af\u09be\u0993\u09af\u09bc\u09be"
            ),
            "hr_bn": U(
                "\u09ad\u09cb\u09b0 ~ \u09b0\u09be\u09a4 \u09e8\u09e8:\u09e6\u09e6 (\u09a6\u09cb\u0995\u09be\u09a8 \u0985\u09a8\u09c1\u09af\u09bc\u09be\u09af\u09bc\u09c0)\u0964"
            ),
            "duty_bn": U("\u09ae\u09be\u09b2\u09bf\u0995 / \u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09be\u09b0"),
        },
    ),
    (
        "jalchatra-road-kitchen",
        "restaurant",
        {
            "name_bn": U(
                "\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ae\u09cb\u09a1\u09bc \u09b0\u09cb\u09a1 \u0995\u09bf\u099a\u09c7\u09a8"
            ),
            "addr_bn": U(
                "\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u09b8\u09dc\u0995, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"
            ),
            "desc_bn": U(
                "\u09b9\u09be\u099f \u0993 \u09aa\u09b0\u09bf\u09ac\u09b9\u09a8 \u099a\u09be\u09aa\u09c7\u09b0 \u09aa\u09be\u09b6\u09c7 \u099a\u09be, \u09b8\u09bf\u0982\u09af\u09bc\u09be\u09b0\u09be, \u09ac\u09bf\u09b0\u09bf\u09af\u09bc\u09be\u09a8\u09bf \u0993 \u09a6\u09c1\u09aa\u09c1\u09b0\u09c7\u09b0 \u09ad\u09be\u09a4\u09c7\u09b0 \u09a6\u09cb\u0995\u09be\u09a8\u0964 "
                "\u09ae\u09cc\u09b8\u09c1\u09ae\u09c7 \u0986\u09a8\u09be\u09b0\u09b8-\u0995\u09b2\u09be \u09ac\u09bf\u0995\u09cd\u09b0\u09c7\u09a4\u09be\u09b0\u09c7\u09b0\u0993 \u0986\u09a8\u09be\u0997\u09cb\u09a8\u09be \u09ac\u09c7\u09b6\u09bf\u0964"
            ),
            "svc_bn": U(
                "\u09ac\u09bf\u09b0\u09bf\u09af\u09bc\u09be\u09a8\u09bf \u00b7 \u09ad\u09be\u09a4-\u09a4\u09b0\u0995\u09be\u09b0\u09bf \u00b7 \u09a8\u09be\u09b8\u09cd\u09a4\u09be \u00b7 \u099a\u09be"
            ),
            "hr_bn": U(
                "\u09b8\u0995\u09be\u09b2 \u09e6:\u09e6\u09e6 ~ \u09b0\u09be\u09a4 \u09e8\u09e7:\u09e6\u09e6\u0964"
            ),
            "duty_bn": U(
                "\u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09be\u09b0 / \u0995\u09cd\u09af\u09be\u09b6\u09bf\u09af\u09bc\u09be\u09b0"
            ),
        },
    ),
    (
        "madhupur-central-supershop",
        "supershop",
        {
            "name_bn": U(
                "\u09ae\u09a7\u09c1\u09aa\u09c1\u09b0 \u09b8\u09c7\u09a8\u09cd\u099f\u09cd\u09b0\u09be\u09b2 \u09b8\u09c1\u09aa\u09be\u09b0 \u09b6\u09aa"
            ),
            "addr_bn": U(
                "\u09ac\u09be\u099c\u09be\u09b0 \u09b0\u09cb\u09a1, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0, \u099f\u09be\u0982\u0997\u09be\u0987\u09b2"
            ),
            "desc_bn": U(
                "\u09ae\u09c1\u09a6\u09bf, \u09a4\u09c7\u09b2-\u09ae\u09b8\u09b2\u09be, \u09b6\u09bf\u09b6\u09c1 \u0996\u09be\u09ac\u09be\u09b0, \u09aa\u09b0\u09bf\u099a\u09cd\u099b\u09a8\u09cd\u09a8\u09a4\u09be \u09aa\u09a3\u09cd\u09af \u0993 \u09a8\u09bf\u09a4\u09cd\u09af \u09aa\u09cd\u09b0\u09af\u09cb\u099c\u09a8\u09c0\u09af\u09bc \u099c\u09bf\u09a8\u09bf\u09b8 \u098f\u0995 \u099b\u09be\u09a6\u09c7\u09b0 \u09a8\u09c0\u099a\u09c7\u0964 "
                "\u09b8\u09be\u09aa\u09cd\u09a4\u09be\u09b9\u09bf\u0995 \u0985\u09ab\u09be\u09b0 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc\u09ad\u09be\u09ac\u09c7 \u099c\u09be\u09a8\u09be \u09af\u09be\u09ac\u09c7\u0964"
            ),
            "svc_bn": U(
                "\u09ae\u09c1\u09a6\u09bf \u00b7 \u09ab\u09cd\u09b0\u09cb\u099c\u09c7\u09a8 \u00b7 \u09aa\u09be\u09a8\u09c0\u09af\u09bc \u00b7 \u09b9\u09cb\u09ae \u0995\u09c7\u09af\u09bc\u09be\u09b0"
            ),
            "hr_bn": U(
                "\u09b8\u0995\u09be\u09b2 \u09e9:\u09e6\u09e6 ~ \u09b0\u09be\u09a4 \u09e8\u09e7:\u09e6\u09e6 (\u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0\u09c7 \u09b8\u09ae\u09af\u09bc \u09b8\u0982\u0995\u09cd\u09b7\u09bf\u09aa\u09cd\u09a4 \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7)\u0964"
            ),
            "duty_bn": U("\u09b6\u09be\u0996\u09be \u09ac\u09cd\u09af\u09ac\u09b8\u09cd\u09a5\u09be\u09aa\u0995"),
        },
    ),
    (
        "jalchatra-bazar-supershop",
        "supershop",
        {
            "name_bn": U(
                "\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0 \u09b8\u09c1\u09aa\u09be\u09b0 \u09b8\u09cd\u099f\u09cb\u09b0"
            ),
            "addr_bn": U(
                "\u099c\u09b2\u099b\u09a4\u09cd\u09b0 \u09ac\u09be\u099c\u09be\u09b0, \u0986\u09b0\u09a8\u0996\u09cb\u09b2\u09be, \u09ae\u09a7\u09c1\u09aa\u09c1\u09b0"
            ),
            "desc_bn": U(
                "\u09b9\u09be\u099f \u098f\u09b2\u09be\u0995\u09be\u09b0 \u09aa\u09be\u0987\u0995\u09be\u09b0 \u0993 \u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u0997\u09cd\u09b0\u09be\u09b9\u0995\u09a6\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09ac\u09b8\u09cd\u09a4\u09be\u09af\u09bc \u099a\u09be\u09b2, \u09a1\u09be\u09b2, \u09a4\u09c7\u09b2 \u0993 \u09a8\u09bf\u09a4\u09cd\u09af\u09aa\u09cd\u09b0\u09df\u09cb\u099c\u09a8\u09c0\u09af\u09bc \u099c\u09bf\u09a8\u09bf\u09b8; "
                "\u0996\u09c1\u099a\u09b0\u09be \u0995\u09c7\u09a8\u09be\u0995\u09be\u099f\u09bf \u09b9\u09af\u09bc\u0964"
            ),
            "svc_bn": U(
                "\u09aa\u09be\u0987\u0995\u09be\u09b0\u09bf \u0993 \u0996\u09c1\u099a\u09b0\u09be \u00b7 \u09b9\u09cb\u09ae \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf (\u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u099a\u09c1\u0995\u09cd\u09a4\u09bf)"
            ),
            "hr_bn": U(
                "\u09ad\u09cb\u09b0 \u09e7:\u09e6\u09e6 ~ \u09b8\u09a8\u09cd\u09a7\u09cd\u09af\u09be \u09e8\u09e6:\u09e6\u09e6\u0964"
            ),
            "duty_bn": U(
                "\u09aa\u09cd\u09b0\u09cb\u09aa\u09cd\u09b0\u09be\u0987\u099f\u09b0 / \u0995\u09be\u0989\u09a8\u09cd\u099f\u09be\u09b0 \u0987\u09a8\u099a\u09be\u09b0\u09cd\u099c"
            ),
        },
    ),
]

en = {
    "jalchatra-bazar": (
        "Jalchatra Bazaar",
        "Arankhola Union, Madhupur, Tangail",
        "A major market on the Madhupur tract for pineapples and bananas; wholesalers and traders come from across Bangladesh. Locally known as Jalchatra.",
        "Retail & wholesale fruit · extra stalls on hat days · transport links",
        "Dawn to evening (hat days and seasons may shift hours).",
        "Bazaar committee / management",
    ),
    "madhupur-bus-stand-bazar": (
        "Main bazar (Madhupur bus stand area)",
        "Near the tri-junction, Madhupur pourashava, Tangail",
        "Daily market by the tri-junction of the Tangail, Mymensingh, and Jamalpur roads—groceries, dry goods, cloth, and traveller services.",
        "Groceries · dry goods · cloth · light meals · traveller amenities",
        "Morning through night (varies by shop).",
        "Bazaar committee / municipal market desk",
    ),
    "madhupur-sadar-jame-mosque": (
        "Madhupur Sadar Central Jame Masjid",
        "Pourashava area, Madhupur, Tangail",
        "Main Friday mosque for the town—prayer, madrasa activity, and religious events. Confirm timings on local notices.",
        "Five daily prayers · Jumuah · funeral & madrasa support",
        "Open Fajr–Isha; Jumuah is busiest.",
        "Imam / mosque management committee",
    ),
    "jalchatra-bazar-jame-mosque": (
        "Jalchatra Bazar Jame Masjid",
        "Adjoining Jalchatra Bazar, Arankhola, Madhupur",
        "Jame mosque serving the hat area—Friday and daily prayers for traders, farmers, and transport workers.",
        "Jumuah · five daily · Eid congregations",
        "According to prayer times.",
        "Khatib-imam / mosque committee",
    ),
    "madhupur-hindu-mandir": (
        "Hindu community Puja Mandir, Madhupur",
        "Pourashava area, Madhupur, Tangail",
        "Community mandir for daily worship and festivals such as Durga and Saraswati Puja—confirm exact local name and committee on site.",
        "Daily worship · festivals · community welfare",
        "Morning & evening arati; extended hours on festivals.",
        "Temple committee / priest",
    ),
    "madhupur-bus-stand-hotel": (
        "Madhupur Bus Stand Hotel & Restaurant",
        "Near the bus stand, Madhupur, Tangail",
        "Rice meals, curries, kebabs, and snacks for travellers and locals—menus vary by stall; typical bus-stand hours.",
        "Set meals · snacks · tea/coffee · takeaway",
        "Early morning ~ 22:00 (varies).",
        "Proprietor / manager",
    ),
    "jalchatra-road-kitchen": (
        "Jalchatra Mor Road Kitchen",
        "Jalchatra Bazar road, Madhupur, Tangail",
        "Tea, singara, biryani, and rice plates beside the hat and truck traffic; busy when fruit traders are in season.",
        "Biryani · rice meals · snacks · tea",
        "06:00–21:00 typical.",
        "Manager / cashier",
    ),
    "madhupur-central-supershop": (
        "Madhupur Central Super Shop",
        "Bazar Road, Madhupur, Tangail",
        "Groceries, spices, baby food, toiletries, and daily needs under one roof—weekly offers posted locally.",
        "Groceries · frozen · beverages · home care",
        "09:00–21:00 (shorter Friday hours possible).",
        "Branch manager",
    ),
    "jalchatra-bazar-supershop": (
        "Jalchatra Bazar Super Store",
        "Jalchatra Bazar, Arankhola, Madhupur",
        "Bulk rice, lentils, oil, and staples for wholesalers and locals at the hat; retail shopping too.",
        "Wholesale & retail · local delivery (arrange on site)",
        "07:00–20:00 typical.",
        "Proprietor / counter in-charge",
    ),
}

images = {
    "jalchatra-bazar": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
    "madhupur-bus-stand-bazar": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    "madhupur-sadar-jame-mosque": "https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?auto=format&fit=crop&w=900&q=80",
    "jalchatra-bazar-jame-mosque": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=80",
    "madhupur-hindu-mandir": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
    "madhupur-bus-stand-hotel": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    "jalchatra-road-kitchen": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    "madhupur-central-supershop": "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80",
    "jalchatra-bazar-supershop": "https://images.unsplash.com/photo-1534723452860-460fff8edd82?auto=format&fit=crop&w=900&q=80",
}

coords = {
    "jalchatra-bazar": (24.617, 90.025),
    "madhupur-bus-stand-bazar": (24.6194, 90.0358),
    "madhupur-sadar-jame-mosque": (24.6191, 90.0345),
    "jalchatra-bazar-jame-mosque": (24.6165, 90.0248),
    "madhupur-hindu-mandir": (24.6203, 90.0328),
    "madhupur-bus-stand-hotel": (24.6195, 90.0362),
    "jalchatra-road-kitchen": (24.6172, 90.0255),
    "madhupur-central-supershop": (24.6185, 90.037),
    "jalchatra-bazar-supershop": (24.6169, 90.024),
}

if __name__ == "__main__":
    for i, (eid, cat, b) in enumerate(entries, start=1):
        n_en, a_en, d_en, s_en, h_en, du_en = en[eid]
        lat, lng = coords[eid]
        phone = f"0171{i}-000000"
        print("  {")
        print(f'    id: "{eid}",')
        print(f'    category: "{cat}",')
        print("    name: {")
        print(f'      bn: u("{esc(b["name_bn"])}"),')
        print(f"      en: {json.dumps(n_en)},")
        print("    },")
        print("    address: {")
        print(f'      bn: u("{esc(b["addr_bn"])}"),')
        print(f"      en: {json.dumps(a_en)},")
        print("    },")
        print("    description: {")
        print(f'      bn: u("{esc(b["desc_bn"])}"),')
        print(f"      en: {json.dumps(d_en)},")
        print("    },")
        print("    services: {")
        print(f'      bn: u("{esc(b["svc_bn"])}"),')
        print(f"      en: {json.dumps(s_en)},")
        print("    },")
        print("    hours: {")
        print(f'      bn: u("{esc(b["hr_bn"])}"),')
        print(f"      en: {json.dumps(h_en)},")
        print("    },")
        print("    image:")
        print(f'      "{images[eid]}",')
        print(f'    dutyPhone: "{phone}",')
        print("    dutyOfficer: {")
        print(f'      bn: u("{esc(b["duty_bn"])}"),')
        print(f"      en: {json.dumps(du_en)},")
        print("    },")
        print(f"    lat: {lat},")
        print(f"    lng: {lng},")
        print("  },")
